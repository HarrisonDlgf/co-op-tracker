from flask import Blueprint, jsonify, request, current_app
from models import Application, User, Achievement, calculate_xp, get_level, safe_add_xp, safe_subtract_xp, safe_set_xp
from database import db
from datetime import datetime, timedelta, timezone
from achievements.achievements_utils import ACHIEVEMENTS
from bulk_import import ApplicationImporter, get_import_template
import jwt

app_routes = Blueprint('routes', __name__)

# rate limiting as to avoid brute force attacks
def limiter():
    return current_app.extensions['limiter']

def create_jwt_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
        'iat': datetime.now(timezone.utc)
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

def verify_jwt_token(token):
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_current_user():
    """Get current user from JWT token or fallback to mock user"""
    auth_header = request.headers.get('Authorization')
    
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        user_id = verify_jwt_token(token)
        if user_id:
            user = User.query.get(user_id)
            return user
    
    # Fallback to mock user for development
    return User.query.filter_by(email="harrison@example.com").first()

def is_northeastern_email(email):
    """Check if email is a Northeastern email"""
    return email and (email.lower().endswith('@northeastern.edu') or email.lower().endswith('@husky.neu.edu'))

@app_routes.route('/auth/google', methods=['POST'])
def google_auth():
    """Handle Google OAuth login"""
    try:
        data = request.get_json()
        
        # Extract user info from Google response
        google_id = data.get('googleId')
        email = data.get('email')
        name = data.get('name')
        picture = data.get('picture')
        
        # Validate Northeastern email
        if not is_northeastern_email(email):
            return jsonify({'error': 'Only Northeastern email addresses are allowed'}), 403
        
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Create new user
            user = User(
                name=name,
                email=email,
                google_id=google_id,
                profile_picture=picture,
                xp=0,
                level=1,
                joined=datetime.now(timezone.utc)
            )
            db.session.add(user)
            db.session.commit()
        
        # Create JWT token
        token = create_jwt_token(user.id)
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'picture': user.profile_picture,
                'xp': user.xp,
                'level': user.level
            }
        })
        
    except Exception as e:
        print(f"Auth error: {e}")
        return jsonify({'error': 'Authentication failed'}), 500

@app_routes.route('/auth/logout', methods=['POST'])
def logout():
    """Handle user logout"""
    # JWT tokens are stateless, so we just return success
    # The frontend will clear the token from localStorage
    return jsonify({'message': 'Logged out successfully'})

@app_routes.route('/auth/refresh', methods=['POST'])
def refresh_token():
    """Refresh JWT token"""
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        user_id = verify_jwt_token(token)
        if user_id:
            user = User.query.get(user_id)
            if user:
                new_token = create_jwt_token(user.id)
                return jsonify({'token': new_token})
    
    return jsonify({'error': 'Invalid token'}), 401

def check_and_award_achievements(user: User):
    '''Check if user qualifies for new achievements'''
    new_achievements = []
    total_xp_gained = 0
    
    # Achievement definitions as of now
    achievements_to_check = ACHIEVEMENTS
    
    # Check each achievement
    for achievement_def in achievements_to_check:
        # Check if user already has this achievement by name
        existing = Achievement.query.filter_by(user_id=user.id, name=achievement_def['name']).first()
        if not existing and achievement_def['condition'](user):
            new_achievement = Achievement(
                name=achievement_def['name'],
                description=achievement_def['description'],
                icon=achievement_def['icon'],
                condition_met=True,
                user_id=user.id
            )
            db.session.add(new_achievement)
            new_achievements.append(new_achievement)
            
            # Award XP for unlocking achievement
            xp_reward = achievement_def.get('xp_reward', 0)
            if xp_reward > 0:
                safe_add_xp(user, xp_reward)
                total_xp_gained += xp_reward
    
    if new_achievements or total_xp_gained > 0:
        db.session.commit()
    
    return new_achievements, total_xp_gained

def check_and_revoke_achievements(user: User):
    revoked_achievements = []
    total_xp_lost = 0
    
    user_achievements = Achievement.query.filter_by(user_id=user.id).all()
    
    for achievement in user_achievements:
        achievement_definition = next((achievement_def for achievement_def in ACHIEVEMENTS if achievement_def['name'] == achievement.name), None)
        
        if achievement_definition and not achievement_definition['condition'](user):
            xp_reward = achievement_definition.get('xp_reward', 0)
            if xp_reward > 0:
                safe_subtract_xp(user, xp_reward)
                total_xp_lost += xp_reward
            
            db.session.delete(achievement)
            revoked_achievements.append(achievement)
    
    if revoked_achievements or total_xp_lost > 0:
        db.session.commit()
    
    return revoked_achievements, total_xp_lost

@app_routes.route('/applications', methods=['GET'])
def get_all_apps():
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify({
        'applications': [
            {
                'id': app.id,
                'company': app.company,
                'position': app.position,
                'status': app.status,
                'applied_date': app.applied_date.isoformat() if app.applied_date else None,
                'notes': app.notes,
                'created_at': app.created_at.isoformat()
            }
            for app in current_user.applications
        ]
    })

@app_routes.route('/applications', methods=['POST'])
def add_app():
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Validate required fields
    if not data.get('company') or not data.get('position') or not data.get('status'):
        return jsonify({'error': 'Company, position, and status are required'}), 400
    
    # Create new application
    new_app = Application(
        company=data['company'],
        position=data['position'],
        status=data['status'],
        applied_date=datetime.fromisoformat(data['applied_date']) if data.get('applied_date') else None,
        notes=data.get('notes'),
        user_id=current_user.id
    )
    
    db.session.add(new_app)
    db.session.commit()
    
    # Award XP based on status
    xp_gained = 0
    if new_app.status == 'Applied':
        xp_gained = 10
    elif new_app.status == 'Interviewing':
        xp_gained = 20
    elif new_app.status == 'Offer':
        xp_gained = 50
    
    if xp_gained > 0:
        safe_add_xp(current_user, xp_gained)
        db.session.commit()
    
    # Check for new achievements
    new_achievements, xp_from_achievements = check_and_award_achievements(current_user)
    
    return jsonify({
        'application': {
            'id': new_app.id,
            'company': new_app.company,
            'position': new_app.position,
            'status': new_app.status,
            'applied_date': new_app.applied_date.isoformat() if new_app.applied_date else None,
            'notes': new_app.notes,
            'created_at': new_app.created_at.isoformat()
        },
        'xp_gained': xp_gained + xp_from_achievements,
        'new_achievements': [{'name': a.name, 'icon': a.icon} for a in new_achievements]
    })

@app_routes.route('/applications/<int:app_id>', methods=['PUT'])
def update_app(app_id):
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    app = Application.query.filter_by(id=app_id, user_id=current_user.id).first()
    if not app:
        return jsonify({'error': 'Application not found'}), 404
    
    data = request.get_json()
    
    # Store old status for XP calculation
    old_status = app.status
    
    # Update application
    if 'company' in data:
        app.company = data['company']
    if 'position' in data:
        app.position = data['position']
    if 'status' in data:
        app.status = data['status']
    if 'applied_date' in data:
        app.applied_date = datetime.fromisoformat(data['applied_date']) if data['applied_date'] else None
    if 'notes' in data:
        app.notes = data['notes']
    
    db.session.commit()
    
    # Award XP if status changed to a higher value
    xp_gained = 0
    status_values = {'Applied': 1, 'Interviewing': 2, 'Offer': 3}
    
    if data.get('status') and data['status'] != old_status:
        old_value = status_values.get(old_status, 0)
        new_value = status_values.get(data['status'], 0)
        
        if new_value > old_value:
            if data['status'] == 'Interviewing':
                xp_gained = 20
            elif data['status'] == 'Offer':
                xp_gained = 50
            
            if xp_gained > 0:
                safe_add_xp(current_user, xp_gained)
                db.session.commit()
    
    # Check for new achievements
    new_achievements, xp_from_achievements = check_and_award_achievements(current_user)
    
    # Check for revoked achievements (in case status change affects qualifications)
    revoked_achievements, xp_lost = check_and_revoke_achievements(current_user)
    
    return jsonify({
        'application': {
            'id': app.id,
            'company': app.company,
            'position': app.position,
            'status': app.status,
            'applied_date': app.applied_date.isoformat() if app.applied_date else None,
            'notes': app.notes,
            'created_at': app.created_at.isoformat()
        },
        'xp_gained': xp_gained + xp_from_achievements - xp_lost,
        'new_achievements': [{'name': a.name, 'icon': a.icon} for a in new_achievements],
        'revoked_achievements': [{'name': a.name, 'icon': a.icon} for a in revoked_achievements],
        'xp_lost': xp_lost
    })

@app_routes.route('/applications/<int:app_id>', methods=['DELETE'])
def delete_app(app_id):
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    app = Application.query.filter_by(id=app_id, user_id=current_user.id).first()
    if not app:
        return jsonify({'error': 'Application not found'}), 404
    
    # Calculate XP to subtract based on the application's status
    xp_to_subtract = calculate_xp(app.status)
    
    # Delete the application
    db.session.delete(app)
    
    # Subtract XP from user's total
    safe_subtract_xp(current_user, xp_to_subtract)
    
    db.session.commit()
    
    # Revoke achievements if user no longer qualifies
    revoked_achievements, xp_lost = check_and_revoke_achievements(current_user)
    
    return jsonify({
        'message': 'Application deleted successfully',
        'xp_subtracted': xp_to_subtract,
        'revoked_achievements': [{'name': a.name, 'icon': a.icon} for a in revoked_achievements],
        'xp_lost': xp_lost,
        'new_xp': current_user.xp,
        'new_level': current_user.level
    })

@app_routes.route('/user/profile', methods=['GET'])
def get_user_profile():
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Calculate stats
    total_applications = len(current_user.applications)
    interviews = len([app for app in current_user.applications if app.status == 'Interviewing'])
    offers = len([app for app in current_user.applications if app.status == 'Offer'])
    
    interview_rate = (interviews / total_applications * 100) if total_applications > 0 else 0
    offer_rate = (offers / total_applications * 100) if total_applications > 0 else 0
    
    return jsonify({
        'user': {
            'id': current_user.id,
            'name': current_user.name,
            'email': current_user.email,
            'picture': current_user.profile_picture,
            'xp': current_user.xp,
            'level': current_user.level,
            'joined': current_user.joined.isoformat()
        },
        'stats': {
            'total_applications': total_applications,
            'interviews': interviews,
            'offers': offers,
            'interview_rate': round(interview_rate, 1),
            'offer_rate': round(offer_rate, 1)
        }
    })

@app_routes.route('/achievements/check', methods=['POST'])
def check_achievements():
    """Manually check and award achievements for current user"""
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Check for new achievements
    new_achievements, xp_gained = check_and_award_achievements(current_user)
    
    return jsonify({
        'new_achievements': [{'name': a.name, 'icon': a.icon, 'xp_reward': ACHIEVEMENTS[next(i for i, ach in enumerate(ACHIEVEMENTS) if ach['name'] == a.name)]['xp_reward']} for a in new_achievements],
        'xp_gained': xp_gained,
        'total_xp': current_user.xp,
        'level': current_user.level
    })

@app_routes.route('/achievements/revoke', methods=['POST'])
def revoke_achievements():
    # remove achievements for current user
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Check for revoked achievements
    revoked_achievements, xp_lost = check_and_revoke_achievements(current_user)
    
    return jsonify({
        'revoked_achievements': [{'name': a.name, 'icon': a.icon, 'xp_reward': ACHIEVEMENTS[next(i for i, ach in enumerate(ACHIEVEMENTS) if ach['name'] == a.name)]['xp_reward']} for a in revoked_achievements],
        'xp_lost': xp_lost,
        'total_xp': current_user.xp,
        'level': current_user.level
    })

@app_routes.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    # get leaderboard data
    try:
        xp_leaderboard = User.query.order_by(User.xp.desc()).limit(25).all()
        
        achievements_leaderboard = db.session.query(User, db.func.count(Achievement.id).label('achievement_count')).join(Achievement, User.id == Achievement.user_id).group_by(User.id).order_by(db.func.count(Achievement.id).desc()).limit(25).all()
        
        # format XP leaderboard
        xp_rankings = []
        for i, user in enumerate(xp_leaderboard, 1):
            xp_rankings.append({
                'rank': i,
                'user_id': user.id,
                'name': user.name,
                'profile_picture': user.profile_picture,
                'xp': user.xp,
                'level': user.level,
                'achievement_count': len(user.achievements)
            })
        
        # Format achievements leaderboard
        achievement_rankings = []
        for i, (user, achievement_count) in enumerate(achievements_leaderboard, 1):
            achievement_rankings.append({
                'rank': i,
                'user_id': user.id,
                'name': user.name,
                'profile_picture': user.profile_picture,
                'xp': user.xp,
                'level': user.level,
                'achievement_count': achievement_count
            })
        
        return jsonify({
            'xp_leaderboard': xp_rankings,
            'achievements_leaderboard': achievement_rankings,
            'last_updated': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        print(f"Leaderboard error: {e}")
        return jsonify({'error': 'Failed to fetch leaderboard'}), 500

@app_routes.route('/health', methods=['GET'])
def health_check():
    # health check endpoint for deployment monitoring
    return jsonify({
        'status': 'healthy',
        'message': 'Co-op Tracker API is running',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

@app_routes.route('/achievements', methods=['GET'])
def get_achievements():
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'achievements': [
            {
                'id': achievement.id,
                'name': achievement.name,
                'description': achievement.description,
                'icon': achievement.icon,
                'condition_met': achievement.condition_met,
                'created_at': achievement.created_at.isoformat()
            }
            for achievement in current_user.achievements
        ]
    })

@app_routes.route('/applications/bulk-import', methods=['POST'])
def bulk_import_applications():
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # adding file validation for 10mb size limit
            file.seek(0, 2)  
            file_size = file.tell()
            file.seek(0) 
            
            if file_size > 10 * 1024 * 1024:
                return jsonify({'error': 'File too large. Maximum size is 10MB'}), 400
            
            filename = file.filename.lower()
            importer = ApplicationImporter(current_user.id)
            
            if filename.endswith('.csv'):
                csv_content = file.read().decode('utf-8')
                result = importer.import_from_csv(csv_content)
            elif filename.endswith(('.xlsx', '.xls')):
                excel_content = file.read()
                result = importer.import_from_excel(excel_content)
            else:
                return jsonify({'error': 'Unsupported file type. Please use CSV or Excel files'}), 400
        elif request.is_json:
            data = request.get_json()
            applications = data.get('applications', [])
            
            if not applications:
                return jsonify({'error': 'No applications provided'}), 400
            
            if len(applications) > 1000:
                return jsonify({'error': 'Too many applications. Maximum is 1000'}), 400
            
            importer = ApplicationImporter(current_user.id)
            result = importer.import_from_json(applications)
        
        else:
            return jsonify({'error': 'No file or JSON data provided'}), 400
        
        # Always commit if there are successful imports
        if result.successful_imports:
            db.session.commit()
            
            if result.total_xp_gained > 0:
                safe_add_xp(current_user, result.total_xp_gained)
                db.session.commit()
            
            new_achievements, xp_from_achievements = check_and_award_achievements(current_user)
            
            if xp_from_achievements > 0:
                result.total_xp_gained += xp_from_achievements
        else:
            db.session.rollback()
        
        # Always return 200 with detailed results
        response_data = result.to_dict()
        if result.successful_imports:
            response_data['new_achievements'] = [{'name': a.name, 'icon': a.icon} for a in new_achievements]
        
        return jsonify(response_data)
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Import failed: {str(e)}'}), 500

@app_routes.route('/applications/import-template', methods=['GET'])
def get_import_template_route():
    return jsonify(get_import_template())

@app_routes.route('/applications/export', methods=['GET'])
def export_applications():
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        import pandas as pd
        from io import StringIO
        
        applications = current_user.applications
        
        data = []
        for app in applications:
            data.append({
                'company': app.company,
                'position': app.position,
                'status': app.status,
                'applied_date': app.applied_date.strftime('%Y-%m-%d') if app.applied_date else '',
                'notes': app.notes or '',
                'created_at': app.created_at.strftime('%Y-%m-%d %H:%M:%S')
            })
        
        df = pd.DataFrame(data)
        
        output = StringIO()
        df.to_csv(output, index=False)
        csv_content = output.getvalue()
        output.close()
        
        return jsonify({
            'csv_content': csv_content,
            'filename': f'applications_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        })
        
    except Exception as e:
        return jsonify({'error': f'Export failed: {str(e)}'}), 500

@app_routes.route('/applications/sample-template', methods=['GET'])
def get_sample_template():
    try:
        with open('sample_import_template.csv', 'r') as f:
            csv_content = f.read()
        
        return jsonify({
            'csv_content': csv_content,
            'filename': 'sample_import_template.csv'
        })
    except Exception as e:
        return jsonify({'error': f'Failed to load template: {str(e)}'}), 500

@app_routes.route('/applications/clear-all', methods=['DELETE'])
def clear_all_applications():
    """Clear all applications for the current user"""
    current_user = get_current_user()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        # Get count before deletion for response
        application_count = len(current_user.applications)
        
        # Delete all applications
        for app in current_user.applications:
            db.session.delete(app)
        
        db.session.commit()
        
        safe_set_xp(current_user, 0)
        db.session.commit()
        
        # Check for revoked achievements 
        revoked_achievements, xp_lost = check_and_revoke_achievements(current_user)
        
        return jsonify({
            'message': f'Successfully deleted {application_count} applications',
            'deleted_count': application_count,
            'revoked_achievements': [{'name': a.name, 'icon': a.icon} for a in revoked_achievements],
            'xp_lost': xp_lost,
            'new_xp': current_user.xp,
            'new_level': current_user.level
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to clear applications: {str(e)}'}), 500