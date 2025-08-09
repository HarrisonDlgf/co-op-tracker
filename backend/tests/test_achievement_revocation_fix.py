"""
Test script to verify achievement revocation works properly when clearing all applications.
This tests the fix for level and XP-based achievements not being revoked.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from models import User, Application, Achievement, calculate_xp, get_level
from achievements.achievements_utils import ACHIEVEMENTS
from routes import check_and_award_achievements, check_and_revoke_achievements
from datetime import datetime, timezone

def test_achievement_revocation_on_clear():
    """Test that level and XP-based achievements are properly revoked when clearing all applications"""
    
    app = create_app()
    
    with app.app_context():
        # Create a test user
        test_user = User(
            name="Test User",
            email="test@northeastern.edu",
            google_id="test123",
            xp=0,
            level=1
        )
        db.session.add(test_user)
        db.session.commit()
        
        print(f"Created test user: {test_user.name}")
        print(f"Initial XP: {test_user.xp}, Level: {test_user.level}")
        
        # Add some applications to give the user XP and level up
        applications = [
            {"company": "Google", "position": "SWE", "status": "Applied"},
            {"company": "Microsoft", "position": "SWE", "status": "Interviewing"},
            {"company": "Apple", "position": "SWE", "status": "Offer"},
            {"company": "Meta", "position": "SWE", "status": "Applied"},
            {"company": "Amazon", "position": "SWE", "status": "Applied"},
        ]
        
        for app_data in applications:
            app = Application(
                company=app_data["company"],
                position=app_data["position"],
                status=app_data["status"],
                user_id=test_user.id
            )
            db.session.add(app)
        
        db.session.commit()
        
        # Calculate expected XP from applications
        expected_xp = sum(calculate_xp(app.status) for app in test_user.applications)
        print(f"Added {len(applications)} applications")
        print(f"Expected XP from applications: {expected_xp}")
        
        # Award XP and check for achievements
        for app in test_user.applications:
            xp_gained = calculate_xp(app.status)
            test_user.xp += xp_gained
        
        test_user.level = get_level(test_user.xp)
        db.session.commit()
        
        print(f"After adding applications - XP: {test_user.xp}, Level: {test_user.level}")
        
        # Check for achievements
        new_achievements, xp_from_achievements = check_and_award_achievements(test_user)
        print(f"Awarded {len(new_achievements)} achievements")
        for achievement in new_achievements:
            print(f"  - {achievement.name} (XP: {next(ach['xp_reward'] for ach in ACHIEVEMENTS if ach['name'] == achievement.name)})")
        
        # Check if user has level-based achievements
        level_achievements = [a for a in test_user.achievements if any(ach['name'] == a.name and 'level' in ach['condition'].__code__.co_names for ach in ACHIEVEMENTS)]
        xp_achievements = [a for a in test_user.achievements if any(ach['name'] == a.name and 'xp' in ach['condition'].__code__.co_names for ach in ACHIEVEMENTS)]
        
        print(f"Level-based achievements: {len(level_achievements)}")
        print(f"XP-based achievements: {len(xp_achievements)}")
        
        # Now clear all applications
        print("\n--- Clearing all applications ---")
        application_count = len(test_user.applications)
        
        # Delete all applications
        for app in test_user.applications:
            db.session.delete(app)
        
        db.session.commit()
        
        # Reset user's XP to 0 (this is the fix)
        test_user.xp = 0
        test_user.level = get_level(test_user.xp)
        db.session.commit()
        
        print(f"After clearing applications - XP: {test_user.xp}, Level: {test_user.level}")
        
        # Check for revoked achievements
        revoked_achievements, xp_lost = check_and_revoke_achievements(test_user)
        
        print(f"Revoked {len(revoked_achievements)} achievements")
        for achievement in revoked_achievements:
            print(f"  - {achievement.name}")
        
        # Check if level and XP achievements were properly revoked
        remaining_level_achievements = [a for a in test_user.achievements if any(ach['name'] == a.name and 'level' in ach['condition'].__code__.co_names for ach in ACHIEVEMENTS)]
        remaining_xp_achievements = [a for a in test_user.achievements if any(ach['name'] == a.name and 'xp' in ach['condition'].__code__.co_names for ach in ACHIEVEMENTS)]
        
        print(f"Remaining level-based achievements: {len(remaining_level_achievements)}")
        print(f"Remaining XP-based achievements: {len(remaining_xp_achievements)}")
        
        # Test results
        success = True
        if remaining_level_achievements:
            print("❌ FAIL: Level-based achievements should have been revoked!")
            success = False
        else:
            print("✅ PASS: All level-based achievements were properly revoked")
            
        if remaining_xp_achievements:
            print("❌ FAIL: XP-based achievements should have been revoked!")
            success = False
        else:
            print("✅ PASS: All XP-based achievements were properly revoked")
        
        # Clean up
        db.session.delete(test_user)
        db.session.commit()
        
        return success

if __name__ == "__main__":
    print("Testing achievement revocation fix...")
    success = test_achievement_revocation_on_clear()
    if success:
        print("\n🎉 All tests passed! Achievement revocation fix is working correctly.")
    else:
        print("\n💥 Some tests failed! Achievement revocation fix needs more work.")
