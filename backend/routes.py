from flask import Blueprint, jsonify, request
from models import Application, User, Achievement, calculate_xp, get_level
from datetime import datetime

app_routes = Blueprint('routes', __name__)

# mock user
current_user = User(
    id=1, 
    name='Harrison', 
    email='harrison@example.com',
    applications=[],
    xp=0,
    level=1,
    joined=datetime.now(),
    achievements=[]
)

def check_and_award_achievements(user: User):
    '''Check if user qualifies for new achievements'''
    new_achievements = []
    
    # Achievement definitions as of now
    achievements_to_check = [
        {
            'id': 1,
            'name': 'First Steps',
            'description': 'Apply to your first co-op of the cycle',
            'icon': '🎯',
            'condition': lambda u: len(u.applications) >= 1
        },
        {
            'id': 2, 
            'name': 'Getting There',
            'description': 'Apply to 10 co-ops',
            'icon': '💪',
            'condition': lambda u: len(u.applications) >= 10
        },
        {
            'id': 3,
            'name': 'Interview Prep Starts Now',
            'description': 'Get your first interview',
            'icon': '🎤',
            'condition': lambda u: len([app for app in u.applications if app.status == 'Interviewing']) >= 1
        },
        {
            'id': 4,
            'name': 'WE DID IT!',
            'description': 'Receive your first offer',
            'icon': '🏆',
            'condition': lambda u: len([app for app in u.applications if app.status == 'Offer']) >= 1
        },
        {
            'id': 5,
            'name': 'Getting Good At This',
            'description': 'Reach level 2',
            'icon': '⭐',
            'condition': lambda u: u.level >= 2
        },
        {
            'id': 6,
            'name': 'XP Hunter',
            'description': 'Earn 500 total XP',
            'icon': '🔥',
            'condition': lambda u: u.xp >= 500
        },
        {
            'id': 7,
            'name': '10 Levels of Co-Op Grind, Wow',
            'description': 'Reach level 10',
            'icon': '🔟',
            'condition': lambda u: u.level >= 10
        }
    ]
    
    # Check each achievement
    for achievement_def in achievements_to_check:
        # Check if user already has this achievement
        existing = next((a for a in user.achievements if a.id == achievement_def['id']), None)
        if not existing and achievement_def['condition'](user):
            new_achievement = Achievement(
                id=achievement_def['id'],
                name=achievement_def['name'],
                description=achievement_def['description'],
                icon=achievement_def['icon'],
                condition_met=True
            )
            user.achievements.append(new_achievement)
            new_achievements.append(new_achievement)
    
    return new_achievements

@app_routes.route('/applications', methods=['GET'])
def get_all_apps():
    return jsonify({
        'applications': [app.__dict__ for app in current_user.applications],
        'total_xp': current_user.xp,
        'level': current_user.level,
        'user': {
            'id': current_user.id,
            'name': current_user.name,
            'email': current_user.email,
            'joined': current_user.joined.isoformat() if current_user.joined else None
        },
        'achievements': [achievement.__dict__ for achievement in current_user.achievements]
    })

@app_routes.route('/applications', methods=['POST'])
def add_app():
    data = request.json
    xp_earned = calculate_xp(data['status'])
    
    new_app = Application(
        id=len(current_user.applications) + 1,
        company=data['company'],
        role=data['role'],
        status=data['status'],
        date_applied=data['date_applied'],
        location=data['location'],
        hybrid_support=data['hybrid_support'],
        hourly_wage=data['hourly_wage'],
        salary=data.get('salary', 0),
        notes=data['notes'],
        potential_benefits=data['potential_benefits'] if 'potential_benefits' in data else None,
        xp=xp_earned
    )
    
    current_user.applications.append(new_app)
    current_user.xp += xp_earned
    current_user.level = get_level(current_user.xp)
    
    # Check for new achievements
    new_achievements = check_and_award_achievements(current_user)
    
    return jsonify({
        'application': new_app.__dict__,
        'total_xp': current_user.xp,
        'level': current_user.level,
        'xp_earned': xp_earned,
        'new_achievements': [achievement.__dict__ for achievement in new_achievements]
    }), 201

@app_routes.route('/applications/<int:app_id>', methods=['PUT'])
def update_app(app_id):
    data = request.json
    for app in current_user.applications:
        if app.id == app_id:
            # Calculate XP difference if status changed
            old_xp = app.xp
            new_status = data['status']
            new_xp = calculate_xp(new_status)
            
            # Update application fields
            app.company = data['company']
            app.role = data['role']
            app.status = new_status
            app.date_applied = data['date_applied']
            app.location = data['location']
            app.hybrid_support = data['hybrid_support']
            app.hourly_wage = data['hourly_wage']
            app.salary = data.get('salary', 0)
            app.notes = data['notes']
            app.potential_benefits = data['potential_benefits'] if 'potential_benefits' in data else None
            app.xp = new_xp
            
            # Update user XP and level
            current_user.xp = current_user.xp - old_xp + new_xp
            current_user.level = get_level(current_user.xp)
            
            # Check for new achievements
            new_achievements = check_and_award_achievements(current_user)
            
            return jsonify({
                'application': app.__dict__,
                'total_xp': current_user.xp,
                'level': current_user.level,
                'xp_change': new_xp - old_xp,
                'new_achievements': [achievement.__dict__ for achievement in new_achievements]
            }), 200
    return jsonify({'error': 'Application not found'}), 404

@app_routes.route('/user/profile', methods=['GET'])
def get_user_profile():
    '''Get user profile with XP, level, achievements, and stats'''
    total_apps = len(current_user.applications)
    interview_apps = len([app for app in current_user.applications if app.status == 'Interviewing'])
    offer_apps = len([app for app in current_user.applications if app.status == 'Offer'])
    
    interview_rate = (interview_apps / total_apps * 100) if total_apps > 0 else 0
    offer_rate = (offer_apps / total_apps * 100) if total_apps > 0 else 0
    
    return jsonify({
        'user': {
            'id': current_user.id,
            'name': current_user.name,
            'email': current_user.email,
            'xp': current_user.xp,
            'level': current_user.level,
            'joined': current_user.joined.isoformat() if current_user.joined else None
        },
        'stats': {
            'total_applications': total_apps,
            'interview_rate': round(interview_rate, 1),
            'offer_rate': round(offer_rate, 1),
            'interviews': interview_apps,
            'offers': offer_apps
        },
        'achievements': [achievement.__dict__ for achievement in current_user.achievements]
    })

@app_routes.route('/achievements', methods=['GET'])
def get_achievements():
    '''Get all achievements (both earned and unearned)'''
    all_achievements = [
        {
            'id': 1,
            'name': 'First Steps',
            'description': 'Apply to your first internship',
            'icon': '🎯',
            'condition_met': any(a.id == 1 for a in current_user.achievements)
        },
        {
            'id': 2,
            'name': 'Grind Master', 
            'description': 'Apply to 10 internships',
            'icon': '💪',
            'condition_met': any(a.id == 2 for a in current_user.achievements)
        },
        {
            'id': 3,
            'name': 'Interview Pro',
            'description': 'Get 5 interviews', 
            'icon': '🎤',
            'condition_met': any(a.id == 3 for a in current_user.achievements)
        },
        {
            'id': 4,
            'name': 'Offer Champion',
            'description': 'Receive your first offer',
            'icon': '🏆', 
            'condition_met': any(a.id == 4 for a in current_user.achievements)
        },
        {
            'id': 5,
            'name': 'Level Up',
            'description': 'Reach level 2',
            'icon': '⭐',
            'condition_met': any(a.id == 5 for a in current_user.achievements)
        },
        {
            'id': 6,
            'name': 'XP Hunter',
            'description': 'Earn 500 total XP',
            'icon': '🔥',
            'condition_met': any(a.id == 6 for a in current_user.achievements)
        }
    ]
    
    return jsonify({
        'achievements': all_achievements,
        'earned_count': len(current_user.achievements),
        'total_count': len(all_achievements)
    })
    