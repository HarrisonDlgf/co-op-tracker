from flask import Flask
from flask_cors import CORS
from routes import app_routes
from database import db

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coop_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# start db 
db.init_app(app)

app.register_blueprint(app_routes)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)