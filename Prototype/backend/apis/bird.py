from flask_restx import Namespace, Resource, fields
from flask import jsonify, Response
import pandas as pd
import difflib

api = Namespace('birds', description='Birds related operations')

# for api prototype - user enters name of bird species to lookup on eBird API
# bird = api.model('Bird', {
#     'species_name':fields.String(required=True, description='The bird identifier')
# })

@api.route('/search/<string:species_name>')
class birdLookup(Resource):
    def get(self, species_name):
        info = getBirdInfo(species_name)
        if info == None: return Response(status = 204) # No species with that name found
        return info

        # Later on, we can store a list of valid bird species and then choose the closest match


# functions for the eBird API

# converts taxonomy CSV into a python dict with common name as key, value = dictionary with other elements
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
            # common name is used for key, not value
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
    return dict

# initializing taxonomy                
taxonomy = getTaxonomyDict()



# Input: common name, Output: dictionary with bird's information, such as sci. name, eBird species code, order, family, etc. See taxonomy2022.csv for keys.
# If exact name not found, returns nearest match
def getBirdInfo(query):
    matches = difflib.get_close_matches(query,taxonomy.keys())
    # No close matches found
    if len(matches) == 0:
        return None
    commonName = matches[0]
    print("User input: " + query + " | Closest match: " + commonName)
    return taxonomy[commonName]


if __name__ == "__main__":
    birb = getBirdInfo('pigeon')
    print(birb)

