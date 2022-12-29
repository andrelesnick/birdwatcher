from bson.json_util import dumps, loads
import json

from flask import current_app, g, jsonify
from werkzeug.local import LocalProxy
from flask_pymongo import PyMongo

from pymongo.errors import DuplicateKeyError, OperationFailure
from bson.objectid import ObjectId
from bson.errors import InvalidId
from dotenv import load_dotenv


def get_db():
    """
    Configuration method to return db instance
    """
    db = getattr(g, "_database", None)

    if db is None:

        db = g._database = PyMongo(current_app).db
       
    return db

# Use LocalProxy to read the global db instance with just `db`
db = LocalProxy(get_db)

def get_user(email, jsonify=True):
    user = db.users.find_one({"email": email})
    print("user:",user)
    return json.loads(dumps(user)) if jsonify else user

def add_user(user):
    if not 'defaultLocation' in user:
        user['defaultLocation'] = 'US-MA'
    db.observations.insert_one({'email': user['email'], 'observations': []})
    return db.users.insert_one({
        "email":user['email'],
        "name": user['name'],
        "token": user['token'],
        "defaultLocation": user['defaultLocation']
    })

def verify_user(email, token):
    user = db.users.find_one({"email": email})
    if user == None:
        return False
    return user['token'] == token

def get_observations(email, jsonify=True):
    observations = db.observations.find_one({"email": email})
    return json.loads(dumps(observations['observations'])) if jsonify else observations['observations']