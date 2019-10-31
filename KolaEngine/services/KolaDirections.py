import requests
import json

class KolaDirections(object):
    """ Manage the Direction data recieved from Mapboxx
    """
    def __init__(self,driver_id=1,rider_id=2,origin=None,destination=None,geometry='geojson',profile='mapbox/driving',annotations=['duration','distance','speed']):
        self.driver_id=driver_id
        self.rider_id=rider_id
        self.origin=origin
        self.destination=destination
        self.profile=profile
        self.geometry=geometry
        self.mapbox_url='https://api.mapbox.com/directions/v5'
        self.access_token=''
        self.distance=0
        self.duration=0
        self.speed=0
        self.route_coords=''
        self.resp_json=None
        self.annotations='speed'
        self.avg_speed=0
        self.get_route_details()
    
    def _get_route_details(self):
        """ Function to get details of route between an origin and destination
        """
        print('In get_route_details')
        query_url=f"{self.mapbox_url}/{self.profile}/"
        query_url=f"{query_url}{self.origin['lng']},{self.origin['lat']};"
        query_url=f"{query_url}{self.destination['lng']},{self.destination['lat']}"
        query_url=f"{query_url}?geometries={self.geometry}"
        query_url=f"{query_url}&annotations={self.annotations}"
        query_url=f"{query_url}&access_token={self.access_token}"
        print(query_url)
        response=requests.get(query_url)
        if response:
            print(response)
            self.resp_json=response.json()
            # print(self.resp_json['routes'])
            # return self.resp_json['routes']
        else:
            print(response)
        
    def parse_resp_json(self):
        """parse the geojson response
        """
        route=self.resp_json['routes'][0]
        self.duration=route['legs'][0]['duration']
        self.distance=route['legs'][0]['distance']
        self.speed=route['legs'][0]['annotation']['speed']
        self.route_coords=route['geometry']['coordinates']
        self.avg_speed=self.distance/self.duration
        self.no_of_coords=len(self.route_coords)
        # print(self.duration)
        # print(self.distance)
        # print(self.speed)
        # print(self.route_coords)
        # print(len(self.route_coords))

    def get_route_details(self):
        self._get_route_details()
        self.parse_resp_json()

if __name__=='__main__':
    origin={'lng':77.62105784956498,'lat':12.914597220292606}
    destination={'lng':77.61030405550855,'lat':12.894129541400005}
    drive=KolaDirections(1,1,origin,destination)
    drive.get_route_details()
    drive.parse_resp_json()