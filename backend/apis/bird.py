from flask_restx import Namespace, Resource, fields
from flask import jsonify, Response, request, make_response
import pandas as pd
import difflib
import os
from dotenv import load_dotenv
from flask import current_app as app
import requests


load_dotenv()


## import db from parent directory
import os,sys
here = os.path.dirname(__file__)

sys.path.append(os.path.join(here, '..'))

import db

##


# Sets CWD to this file
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)


api = Namespace('birds', description='Birds related operations')


@api.route('/search/<string:species_name>')
class eBirdLookup(Resource):
    def get(self, species_name):
        info = getBirdInfo(species_name)
        if info == None: return Response(status = 204) # No species with that name found
        return info



EBIRD_KEY = os.getenv('EBIRD_KEY')
PEXELS_API_KEY = os.getenv('PEXELS_API_KEY')

# gets data from all three APIs and returns it
@api.route('/search/allData/<string:species_name>/<string:email>/<string:token>')
class getAllData(Resource):
    def get(self, species_name, email, token):
        if token == None or not db.verify_user(email, token):
            return Response(status = 401)

        info = {}
        info['eBird'] = getBirdInfo(species_name)
        if info['eBird'] == None: return make_response({'error': 'Species does not exist'}, 400) # No species with that name found

        info['photos'] = getPhotos(species_name)
        info['recordings'] = getAudio(species_name)

        return make_response(info, 200)

# Input: species name string
# Output: list containing three images from Pexels API
def getPhotos(name):
    # make request to pexels api
    url = 'https://api.pexels.com/v1/search?query=' + name + ' bird&per_page=3'
    headers = {'Authorization': PEXELS_API_KEY}
    print(headers)
    response = requests.get(url, headers=headers)
    response = response.json()

    # get image URLs
    photos = []
    print(response)
    for photo in response['photos']:
        photos.append(photo['src']['original'])

    return photos

# Input: species name string
# Output: audio file URL from Xenocanto API
def getAudio(name):
    
    # make request to xenocanto api
    url = 'https://www.xeno-canto.org/api/2/recordings?query=' + name
    response = requests.get(url)
    response = response.json()

    # get audio URL
    recordings = []
    for i, bird in enumerate(response['recordings']):
        if i < 3:
            recordings.append(bird['file'])
        else:
            break
    print(recordings)
    return recordings

# functions for the eBird API

# converts taxonomy CSV into a python dict with common name, species code, AND sci name as keys, value = dictionary with other elements
def getTaxonomyDict():
    dict = {}
    with open('taxonomy2022.csv', 'r') as file:
        # SCIENTIFIC_NAME,COMMON_NAME,SPECIES_CODE,CATEGORY,TAXON_ORDER,COM_NAME_CODES,SCI_NAME_CODES,BANDING_CODES,ORDER,FAMILY_COM_NAME,FAMILY_SCI_NAME,REPORT_AS,EXTINCT,EXTINCT_YEAR,FAMILY_CODE
        lines = file.readlines()
        for line in lines:
            line = line.replace('\n', '') # remove new line character at end of each line
            birdValues = line.split(',')
            birdProperties = {}
            
            birdProperties['SCIENTIFIC_NAME'] = birdValues[0]
            birdProperties['COMMON_NAME'] = birdValues[1]
            birdProperties['SPECIES_CODE'] = birdValues[2]
            
            birdProperties['CATEGORY'] = birdValues[3]
            birdProperties['TAXON_ORDER'] = birdValues[4]
            birdProperties['COM_NAME_CODES'] = birdValues[5]
            birdProperties['SCI_NAME_CODES'] = birdValues[6]
            birdProperties['BANDING_CODES'] = birdValues[7]
            birdProperties['ORDER'] = birdValues[8]
            birdProperties['FAMILY_COM_NAME'] = birdValues[9]
            birdProperties['FAMILY_SCI_NAME'] = birdValues[10]
            birdProperties['REPORT_AS'] = birdValues[11]
            birdProperties['EXTINCT'] = birdValues[12]
            birdProperties['EXTINCT_YEAR'] = birdValues[13]
            birdProperties['FAMILY_CODE'] = birdValues[14]

            dict[birdValues[1]] = birdProperties
            dict[birdValues[0]] = birdProperties
            dict[birdValues[2]] = birdProperties
    return dict

@api.route("/notableSightings/<string:location>")
class NotableSightings(Resource):
    def get(self, location):
        # get location code
        url = 'https://api.ebird.org/v2/data/obs/'+location+'/recent/notable?key=' + EBIRD_KEY+"&maxResults=20"
        response = requests.get(url)
        response = response.json()
        return response
# initializing taxonomy                
taxonomy = getTaxonomyDict()

# pexels API
#modify this later to fit parameters if incorrect
#used if we want one image, we can fit more properties if needed (see below)


# Input: common name, scientific name, or species code | Output: dictionary with bird's information, such as sci. name, eBird species code, order, family, etc. See getTaxonomyDict() for keys.
# If exact name not found, returns nearest match
def getBirdInfo(query):
    matches = difflib.get_close_matches(query,taxonomy.keys())
    # No close matches found
    if len(matches) == 0:
        return None
    match = matches[0]
    print("User input: " + query + " | Closest match: " + match)
    return taxonomy[match]


if __name__ == "__main__":
    birb = getBirdInfo('Columba livia')
    print(birb)

