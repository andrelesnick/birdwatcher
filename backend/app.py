
import os
import requests
from flask_restx import Api
from flask import Flask, jsonify, render_template
from apis import api
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import json

load_dotenv()

# Get API Key

app = Flask(__name__)
CORS(app)
api.init_app(app)

if __name__ == "__main__":
    app.config['MONGO_URI'] = os.getenv('DB_URI')
    app.run(debug=True)


