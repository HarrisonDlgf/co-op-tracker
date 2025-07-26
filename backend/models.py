from datetime import datetime
from database import db

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # Applied, Interviewing, Offer, Rejected
    applied_date = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign key to user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(10), nullable=False)
    condition_met = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # add a fk to user, each achievement belongs to one user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    google_id = db.Column(db.String(100), unique=True, nullable=True)
    profile_picture = db.Column(db.String(500), nullable=True)
    xp = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    joined = db.Column(db.DateTime, default=datetime.utcnow)
    
    applications = db.relationship('Application', backref='user', lazy=True, cascade='all, delete-orphan')
    achievements = db.relationship('Achievement', backref='user', lazy=True, cascade='all, delete-orphan')

class OfferFeedPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100))
    role = db.Column(db.String(100))
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    message = db.Column(db.String(100))
    xp_awarded = db.Column(db.Integer, default=0)

    # add a fk to user, each post belongs to one user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 
    
def calculate_xp(status: str) -> int:
    #Calculate the user's xp based on an applications status
    xp_map = {
        'Applied': 10,
        'Interviewing': 50,
        'Offer': 250,
        'Rejected': 10,  # Small XP for effort, add a notification for "well done"
        'Ghosted': 10,   # feels bad
        'Withdrawn': 0 
    }
    return xp_map.get(status, 0)

def get_level(xp: int) -> int:
    #Calculate level based on xp
    #TODO: make the levels harder as the users progress
    return (xp // 100) + 1 