from flask import Flask
from flask_cors import CORS
from database import db
from routes import app_routes
import os
from config import config
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def create_app(config_name=None):
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    
    # Override database URL to ensure PostgreSQL is used
    if os.environ.get('DATABASE_URL'):
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    
    # Initialize extensions
    db.init_app(app)
    
    # Security middleware
    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(app_routes)
    
    return app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)