import os
import time

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError

from config import config
from database import db
from routes import app_routes

# Load environment variables from .env file
load_dotenv()

def create_app(config_name=None):
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    
    # Security middleware
    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(app_routes)
    
    return app

def init_db(app, max_retries=5, retry_delay=3):
    """Create tables; retry while Render Postgres wakes from sleep."""
    for attempt in range(max_retries):
        try:
            with app.app_context():
                db.create_all()
            return
        except OperationalError:
            if attempt == max_retries - 1:
                raise
            time.sleep(retry_delay * (attempt + 1))


app = create_app()
init_db(app)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)