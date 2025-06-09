import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from werkzeug.exceptions import HTTPException
from dotenv import load_dotenv

from config import Config
from models import db, User
from blacklist import BLACKLIST
from routes.products import bp as product_routes
from routes.auth import auth_bp
from routes.cart import cart_bp

app = Flask(__name__)
app.config.from_object(Config)
load_dotenv()
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in BLACKLIST

db.init_app(app)
migrate = Migrate(app, db)

frontend_url = os.getenv("FRONTEND_URL")

CORS(
    app,
    supports_credentials=True,
    origins=[frontend_url],
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

app.register_blueprint(product_routes)
app.register_blueprint(auth_bp)
app.register_blueprint(cart_bp)

@app.errorhandler(400)
def bad_request(e):
    return jsonify({'error': 'Bad request'}), 400

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Server error'}), 500

@app.route("/")
def home():
    return "Flask app running successfully 🚀"

with app.app_context():
    db.create_all()
    print("✅ Tables created (if not exist)")

if __name__ == "__main__":
    app.run(debug=True)

