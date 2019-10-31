from flask import Flask
from flask import request,jsonify,make_response,Response
from flask_cors import CORS

from services.KolaDB.Trips import Trips
from services.KolaDriver import KolaDriver
from services.KolaRider import KolaRider

import pprint


app=Flask(__name__)
CORS(app)

# export FLASK_APP=KolaEngine.py
# export FLASK_RUN_PORT=9000

@app.route('/api/v1/')
def def_route():
    return "Hello In The world is tno tht esam"

def _build_cors_prelight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# @app.route('/routeDirsOld',methods=['POST','OPTIONS','GET'])
# def get_route_dir_coords():
#     if request.method=='OPTIONS':
#         return _build_cors_prelight_response()
#     elif request.method == 'POST':
#         print('In Post')
#         print(request.get_json())
#         return _corsify_actual_response(jsonify({'response':'All Good'}))
#     else:
#         return 'No Clue what happened'


@app.route('/api/v1/getAllTrips')
def get_all_trips(methods=['GET']):
    tp=Trips.cre_all_trip()
    print(jsonify(tp.get_all_trips()))
    return jsonify(tp.get_all_trips())


@app.route('/api/v1/getTripDets/<trip_id>')
def get_trip_details(trip_id,methods=['GET']):
    print(f'The Trip Details for trip {trip_id}')
    tp=Trips.cre_view_trip(trip_id)
    print(jsonify({'response':tp.get_trip_details(trip_id)}))
    return jsonify({'response':tp.get_trip_details(trip_id)})


@app.route('/api/v1/simuDriver/<trip_id>')
def simu_drive(trip_id,methods=['GET']):
    print(f'The Trip Details for trip {trip_id}')
    tp=Trips.cre_view_trip(trip_id)
    print('=@'*80)
    # pprint.pprint(tp.get_trip_details(trip_id))
    # print('='*80)
    kd = KolaDriver(tp.get_trip_details(trip_id))
    # pprint.pprint(jsonify(tp.get_trip_details(trip_id)))
    kd.simu_driver_mvmnt()
    return jsonify({'response':tp.get_trip_details(trip_id)})

@app.route('/api/v1/simuRider/<trip_id>')
def simu_rider(trip_id,methods=['GET']):
    print(f'Trip Id {trip_id}')
    kd = KolaRider()
    ret_val=kd.simu_rider()
    print(ret_val)
    return jsonify({'response':ret_val})


@app.route('/api/v1/createTrip',methods=['POST'])
def get_cre_trip():
    if request.method == 'POST':
        print('In Post get_route_dir_coords')
        print(request.get_json())
        tp=Trips.cre_trip(request.get_json())
        trip_data=tp.cre_trip_data()
        return jsonify({'response':trip_data})
    else:
        return 'No Clue what happened'


@app.route('/json-example', methods=['POST']) #GET requests will be blocked
def json_example():
    req_data = request.get_json()

    language = req_data['language']
    framework = req_data['framework']
    python_version = req_data['version_info']['python'] #two keys are needed because of the nested object
    example = req_data['examples'][0] #an index is needed because of the array
    boolean_test = req_data['boolean_test']

    return '''
           The language value is: {}
           The framework value is: {}
           The Python version is: {}
           The item at index 0 in the example list is: {}
           The boolean value is: {}'''.format(language, framework, python_version, example, boolean_test)

if __name__=='__main__':
    app.run(port='9000')