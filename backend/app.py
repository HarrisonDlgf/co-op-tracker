from flask import Flask
from flask_cors import CORS
from routes import app_routes

app = Flask(__name__)
CORS(app)

app.register_blueprint(app_routes)

if __name__ == "__main__":
    app.run(debug=True)