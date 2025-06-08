import requests
import jwt
from flask import request, jsonify
from functools import wraps

COGNITO_REGION = "us-east-1"
COGNITO_USERPOOL_ID = "us-east-1_K1gI1J7Qa"
COGNITO_APP_CLIENT_ID = "50lh9ekril77rbfqrofcuiknrs"

JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USERPOOL_ID}/.well-known/jwks.json"
jwks = requests.get(JWKS_URL).json()

def cognito_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401

        token = auth_header.split(" ")[1]
        try:
            decoded = jwt.decode(
                token,
                key=jwt.PyJWKClient(JWKS_URL).get_signing_key_from_jwt(token).key,
                algorithms=["RS256"],
                audience=COGNITO_APP_CLIENT_ID,
            )
            request.user = decoded  
        except Exception as e:
            return jsonify({"error": str(e)}), 401

        return f(*args, **kwargs)
    return decorated