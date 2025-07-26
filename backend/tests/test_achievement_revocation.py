import pytest
import time
from datetime import datetime, timezone
from models import User, Application, Achievement, db
from achievements.achievements_utils import ACHIEVEMENTS
from routes import check_and_revoke_achievements
from app import create_app

def test_achievement_revocation_on_application_deletion():
    app = create_app()
    with app.app_context():
        # Create a test user
        timestamp = int(time.time())
        user = User(
            name="Test User 1",
            email=f"test1_{timestamp}@northeastern.edu",
            xp=0,
            level=1
        )
        db.session.add(user)
        db.session.commit()
        
        # Add 10 applications to qualify for "Getting There" achievement
        for i in range(10):
            application = Application(
                company=f"Company {i}",
                position=f"Position {i}",
                status="Applied",
                user_id=user.id
            )
            db.session.add(application)
        
        db.session.commit()
        
        # Check that user has 10 applications
        assert len(user.applications) == 10
        
        # Manually award the "Getting There" achievement
        getting_there_achievement = Achievement(
            name="Getting There",
            description="Apply to 10 co-ops",
            icon="💪",
            condition_met=True,
            user_id=user.id
        )
        db.session.add(getting_there_achievement)
        
        # Award XP for the achievement
        user.xp += 50  # XP reward for "Getting There"
        db.session.commit()
        
        # Verify achievement exists and XP was awarded
        assert len(user.achievements) == 1
        assert user.xp == 50
        
        # Delete 5 applications (bringing total to 5)
        for i in range(5):
            application = user.applications[i]
            db.session.delete(application)
        
        db.session.commit()
        
        # Check that user now has 5 applications
        assert len(user.applications) == 5
        
        # Check for revoked achievements
        revoked_achievements, xp_lost = check_and_revoke_achievements(user)
        
        # Verify achievement was revoked and XP was lost
        assert len(revoked_achievements) == 1
        assert revoked_achievements[0].name == "Getting There"
        assert xp_lost == 50
        assert user.xp == 0
        
        # Verify achievement no longer exists in database
        db.session.refresh(user)
        assert len(user.achievements) == 0

def test_achievement_revocation_on_status_change():
    """Test that achievements are revoked when application status changes"""
    
    app = create_app()
    with app.app_context():
        # Create a test user
        timestamp = int(time.time())
        user = User(
            name="Test User 2",
            email=f"test2_{timestamp}@northeastern.edu",
            xp=0,
            level=1
        )
        db.session.add(user)
        db.session.commit()
        
        # Add 5 applications with "Interviewing" status
        for i in range(5):
            application = Application(
                company=f"Company {i}",
                position=f"Position {i}",
                status="Interviewing",
                user_id=user.id
            )
            db.session.add(application)
        
        db.session.commit()
        
        # Manually award the "Interview Pro" achievement
        interview_pro_achievement = Achievement(
            name="Interview Pro",
            description="Get 5 interviews",
            icon="🎭",
            condition_met=True,
            user_id=user.id
        )
        db.session.add(interview_pro_achievement)
        
        # Award XP for the achievement
        user.xp += 150  # XP reward for "Interview Pro"
        db.session.commit()
        
        # Verify achievement exists and XP was awarded
        assert len(user.achievements) == 1
        assert user.xp == 150
        
        # Change 3 applications to "Applied" status
        for i in range(3):
            user.applications[i].status = "Applied"
        
        db.session.commit()
        
        # Check for revoked achievements
        revoked_achievements, xp_lost = check_and_revoke_achievements(user)
        
        # Verify achievement was revoked and XP was lost
        assert len(revoked_achievements) == 1
        assert revoked_achievements[0].name == "Interview Pro"
        assert xp_lost == 150
        assert user.xp == 0
        
        # Verify achievement no longer exists in database
        db.session.refresh(user)
        assert len(user.achievements) == 0

def test_no_achievement_revocation_when_still_qualified():
    """Test that achievements are not revoked when user still qualifies"""
    
    app = create_app()
    with app.app_context():
        # Create a test user
        timestamp = int(time.time())
        user = User(
            name="Test User 3",
            email=f"test3_{timestamp}@northeastern.edu",
            xp=0,
            level=1
        )
        db.session.add(user)
        db.session.commit()
        
        # Add 15 applications to qualify for "Getting There" achievement
        for i in range(15):
            application = Application(
                company=f"Company {i}",
                position=f"Position {i}",
                status="Applied",
                user_id=user.id
            )
            db.session.add(application)
        
        db.session.commit()
        
        # Manually award the "Getting There" achievement
        getting_there_achievement = Achievement(
            name="Getting There",
            description="Apply to 10 co-ops",
            icon="💪",
            condition_met=True,
            user_id=user.id
        )
        db.session.add(getting_there_achievement)
        
        # Award XP for the achievement
        user.xp += 50
        db.session.commit()
        
        # Delete 2 applications (bringing total to 13, still above threshold)
        for i in range(2):
            application = user.applications[i]
            db.session.delete(application)
        
        db.session.commit()
        
        # Check for revoked achievements
        revoked_achievements, xp_lost = check_and_revoke_achievements(user)
        
        # Verify no achievements were revoked
        assert len(revoked_achievements) == 0
        assert xp_lost == 0
        assert user.xp == 50
        
        # Verify achievement still exists
        db.session.refresh(user)
        assert len(user.achievements) == 1 