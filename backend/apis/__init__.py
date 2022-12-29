from flask import Flask, Blueprint
from flask_restx import Resource, Api, Namespace, fields
from .bird import api as birds
from .auth import api as auth
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import json

# https://flask-restx.readthedocs.io/en/latest/scaling.html

api = Api(
    title='Birdwatcher REST',
    version='1.0',
    description='A description',
    # All API metadatas
)

api.add_namespace(birds, path="/api/bird")
api.add_namespace(auth, path="/api/auth")

