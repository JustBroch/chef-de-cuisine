from flask import Flask
from config import Config
from models import db, bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from auth import auth

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(auth)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)