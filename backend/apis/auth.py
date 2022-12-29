import json
from flask import Flask, request, jsonify, make_response
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_restx import Namespace, Resource, fields
from flask import current_app as app


## necessary to import db from parent directory
import os,sys
here = os.path.dirname(__file__)

sys.path.append(os.path.join(here, '..'))

import db
from apis.bird import getBirdInfo
##


api = Namespace('auth', description='Authentication related operations')

# user = api.model('User', {
#     'email': fields.String(required=True, description='The user email'),
#     'token': fields.String(required=True, description='The user token'),
#     'name': fields.String(required=True, description='The user name'),
#     'defaultLocation': fields.String(required=True, description='The user\'s default location, stored as country-state', default='US-MA'),
# })

@api.route('/signup')
class Signup(Resource):
    def post(self):
        data = request.get_json()
        print(data)
        user = db.get_user(data["email"])
        if user == None:
            id = db.add_user(data)
            return make_response({'id': id.inserted_id}, 200)
        return make_response({'error': 'User already exists'}, 400)

@api.route('/login')
class Login(Resource):
    def post(self):
        data = request.get_json()
        print("User data from frontend:",data)
        user = db.get_user(data['email'])
        print("User:",user)
        if user == None:
            print("User does not exist, adding user:",data['email'])
            db.add_user(data)
            data['defaultLocation'] = 'US-MA'
        # user exists
        db.db.users.update_one({'email': data['email']}, {'$set': {'token': data['token']}})   
        return make_response({'user': db.get_user(data['email'])}, 200)


# update user's name and default location
@api.route('/update')
class Update(Resource):
    def post(self):
        data = request.get_json()
        if not db.verify_user(data['email'], data['token']):
            return make_response({'error': 'User does not exist or invalid token'}, 400)
        # user exists
        db.db.users.update_one({'email': data['email']}, {'$set': {'name': data['name'], 'defaultLocation': data['defaultLocation']}})
        print("User successfully updated:",str(data))
        return make_response({'success': 'user '+data['email']+ 'successfully updated'}, 200)

# add bird observation to user's list
@api.route('/observations')
class Observations(Resource):
    def post(self):
        print("Adding observation")
        data = request.get_json()
        if not db.verify_user(data['email'], data['token']):
            return make_response({'error': 'User does not exist or invalid token'}, 400)
        # user exists

        # identify bird species
        bird = getBirdInfo(data['observation']['name'])
        name = bird['COMMON_NAME'] + ' (' + bird['SCIENTIFIC_NAME'] + ')'
        print("Bird identified:",name)
        data['observation']['name'] = name
        
        db.db.observations.update_one({'email': data['email']}, {'$push': {'observations': data['observation']}}, upsert=True)
        print("Observation successfully added:",str(data))
        return make_response({'name': name}, 200)

    def get(self):
        email = request.args.get('email')
        token = request.args.get('token')

        if not db.verify_user(email, token):
            return make_response({'error': 'User does not exist or invalid token'}, 400)
        # user exists
        print("Returning observation list for user:",email)
        return make_response({'observations': db.get_observations(email)}, 200)