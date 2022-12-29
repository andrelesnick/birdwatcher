
import os
import requests
from flask_restx import Api
from flask import Flask, jsonify
from apis import api
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

# Get API Key
KEY = os.getenv('KEY')

app = Flask(__name__)
CORS(app)
api.init_app(app)

if __name__ == "__main__":
    # get_taxonomy()
    app.run(debug=True)
