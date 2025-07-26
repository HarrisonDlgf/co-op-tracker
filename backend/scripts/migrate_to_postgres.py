#!/usr/bin/env python3
"""
Simple migration script to move from SQLite to PostgreSQL
"""

import os
from sqlalchemy import create_engine, text
from models import User, Application, Achievement
from database import db
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def migrate_to_postgres():
    """Migrate data from SQLite to PostgreSQL"""
    
    # SQLite source
    sqlite_url = 'sqlite:///instance/coop_tracker.db'
    sqlite_engine = create_engine(sqlite_url)
    
    # PostgreSQL destination - use environment variable
    pg_url = os.environ.get('DATABASE_URL')
    if not pg_url:
        print("❌ DATABASE_URL environment variable not set")
        return False
    
    print(f"Using PostgreSQL URL: {pg_url}")
    pg_engine = create_engine(pg_url)
    
    print("Starting migration...")
    
    try:
        # Create tables in PostgreSQL
        with pg_engine.connect() as conn:
            # Create tables
            db.metadata.create_all(pg_engine)
            print("✅ PostgreSQL tables created")
        
        # Migrate data
        with sqlite_engine.connect() as sqlite_conn:
            # Migrate users
            users = sqlite_conn.execute(text("SELECT * FROM user")).fetchall()
            print(f"Found {len(users)} users to migrate")
            
            for user in users:
                with pg_engine.connect() as pg_conn:
                    pg_conn.execute(text("""
                        INSERT INTO "user" (id, name, email, google_id, profile_picture, xp, level, joined)
                        VALUES (:id, :name, :email, :google_id, :profile_picture, :xp, :level, :joined)
                    """), user._asdict())
                    pg_conn.commit()
            
            # Migrate applications
            apps = sqlite_conn.execute(text("SELECT * FROM application")).fetchall()
            print(f"Found {len(apps)} applications to migrate")
            
            for app in apps:
                with pg_engine.connect() as pg_conn:
                    pg_conn.execute(text("""
                        INSERT INTO application (id, company, position, status, applied_date, notes, created_at, user_id)
                        VALUES (:id, :company, :position, :status, :applied_date, :notes, :created_at, :user_id)
                    """), app._asdict())
                    pg_conn.commit()
            
            # Migrate achievements
            achievements = sqlite_conn.execute(text("SELECT * FROM achievement")).fetchall()
            print(f"Found {len(achievements)} achievements to migrate")
            
            for achievement in achievements:
                achievement_dict = achievement._asdict()
                # Convert SQLite integer boolean to PostgreSQL boolean
                achievement_dict['condition_met'] = bool(achievement_dict['condition_met'])
                
                with pg_engine.connect() as pg_conn:
                    pg_conn.execute(text("""
                        INSERT INTO achievement (id, name, description, icon, condition_met, created_at, user_id)
                        VALUES (:id, :name, :description, :icon, :condition_met, :created_at, :user_id)
                    """), achievement_dict)
                    pg_conn.commit()
        
        print("✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    migrate_to_postgres() 