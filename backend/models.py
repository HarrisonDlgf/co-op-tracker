from dataclasses import dataclass, field
from typing import Optional, List
from datetime import datetime
from database import db

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(120))
    role = db.Column(db.String(120))
    status = db.Column(db.String(50)) #TODO: may want an enum: applied, interviewing, offer, rejected
    date_applied = db.Column(db.DateTime)
    location = db.Column(db.String(50)) # can be hybrid, remote, in-person
    hybrid_support = db.Column(db.String(50)) # can be partial, full, none
    hourly_wage = db.Column(db.Integer)
    salary = Optional[db.Column(db.Integer)] #TODO: check if this is how to do optional cols
    notes = db.Column(db.Text) #want this data type to be large
    potential_benefits = db.Column(db.String(120)) #also optional string
    xp = db.Column(db.Integer, default=0) #xp earned for this applicatoin
    
    # add a fk to user, each application can be N:M
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 

class Achievement:
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    icon = db.Column(db.String(100))
    condition_met = db.Column(db.Boolean, default=False) #TODO: check if this is how to do a bool
    
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    xp = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    joined = db.Column(db.DateTime)
    
    applications = db.relationship('Application', backref='user', lazy=True)
    achievements = db.relationship('Achievement', backref='user', lazy=True)

class OfferFeedPost:
    id = db.Column(db.Integer, primary_key=True)
    company =  db.Column(db.String(100))
    role =  db.Column(db.String(100))
    date_posted = db.Column(db.DateTime)
    message =  db.Column(db.String(100))
    xp_awarded = db.Column(db.Integer, default=0)

    # add a fk to user, each post can be 1:1
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 
    
def calculate_xp(status: str) -> int:
    #Calculate the user's xp based on an applications status
    xp_map = {
        'Applied': 10,
        'Interviewing': 50,
        'Offer': 250,
        'Rejected': 10,  # Small XP for effort, add a notifcation for "well done"
        'Ghosted': 10,   # feels bad
        'Withdrawn': 0 
    }
    return xp_map.get(status, 0)

def get_level(xp: int) -> int:
    #Calculate level based on xp
    #TODO: make the levels harder as the users progress
    return (xp // 100) + 1 