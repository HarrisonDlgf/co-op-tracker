"""
Database initialization script
Run this to set up your SQLite database for offline development
"""

from app import app, db
from models import User, Application, Achievement
from datetime import datetime

def create_mock_user():
    #mock user for testing
    with app.app_context():
        # Check if user already exists
        existing_user = User.query.filter_by(email="harrison@example.com").first()
        if not existing_user:
            mock_user = User(
                name="Harrison",
                email="harrison@example.com",
                xp=0,
                level=1,
                joined=datetime.now()
            )
            db.session.add(mock_user)
            db.session.commit()
            print(f"✅ Created mock user: {mock_user.name} (ID: {mock_user.id})")
            return mock_user
        else:
            print(f"✅ Mock user already exists: {existing_user.name} (ID: {existing_user.id})")
            return existing_user

if __name__ == "__main__":
    print("🚀 Initializing Co-Op Tracker Database...")
    
    with app.app_context():
        db.create_all()
    print("✅ Database tables created")
    user = create_mock_user()
    
    print("\n🎉 Database ready for offline development!")
    print("You can now run: python app.py") 