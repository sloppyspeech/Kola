from datetime import datetime as dt
import random
import pprint
from .DBService import DB as KDB
import pickle
"""
[{
            "measurement": "TripMaster",
            "tags": {
                "DriverID": "D-01",
                "TripID": "R-01",
                "Riders":[{"riderid":"Rider-01"}]
            },
            "time": "2009-11-10T23:00:00Z",
            "fields": {
                "Origin": 0.64,
                "Destination": 3,
                "Duration": 1356,
                "Distance": 5000.1,
                "AvgSpeed": 3.5,
                "Coordinates":[
                    [lng,lat],[lng,lat]
                ]
            }
}]
"""
class Trips(object):
    """[summary]
    
    Arguments:
        object {[type]} -- [description]
    """
    def __init__(self,origin,destination,duration,distance,avg_speed,coords,trip_id=None):
        """[summary]
        """
        self.driverId=random.Random()
        self.riderID=random.Random()
        # self.driverId.seed(50)
        # self.riderID.seed(500)

        self.origin=origin
        self.destination=destination
        self.duration=duration
        self.distance=distance
        self.avg_speed=avg_speed
        self.coords=coords
        self.trip_id=trip_id
        self.trip_data=[]
        self.kdb=KDB()

    
    @staticmethod
    def get_datetime():
        return dt.now().strftime('%d-%m-%Y:%H:%M:%S:%f')
    
    def get_driverid(self):
        """Get Driver ID based on random number
        """
        return 'D-{0:02d}'.format(self.driverId.randint(1,50))
    
    def get_riderId(self):
        """Get Rider ID based on random number
        """
        return 'R-{0:03d}'.format(self.riderID.randint(1,500))
    
    def get_riders(self,pax):
        riders=[]
        for i in range(pax):
            riders.append({"riderid":self.get_riderId()})
        return riders

    def get_tripId(self):
        """Get Trip ID based on random number
        """
        return 'T-{0:04d}'.format(random.Random().randint(1,5000))

    def prep_trip_data(self):
        p_data={}
        p_data["measurement"]="TripMaster"
        p_data["tags"]={}
        p_data["tags"]["TripId"]=self.get_tripId()
        p_data["tags"]["DriverId"]=self.get_driverid()
        p_data["tags"]["Riders"]=self.get_riders(3)
        # p_data["time"]=self.get_datetime()
        p_data["fields"]={}
        p_data["fields"]["origin"]=self.origin
        p_data["fields"]["destination"]=self.destination
        p_data["fields"]["distance"]=float(self.distance)
        p_data["fields"]["duration"]=int(self.duration)
        p_data["fields"]["avg_speed"]=self.avg_speed
        p_data["fields"]["coords"]=str(self.coords)
        print("*"*80)
        pprint.pprint(p_data)
        print("*"*80)
        self.trip_data.append(p_data)

    @classmethod
    def cre_view_trip(cls,trip_id):
        return cls("","","","","","",trip_id)


    @classmethod
    def cre_all_trip(cls):
        return cls("","","","","","","")


    @classmethod    
    def cre_trip(cls,dir_json):
        # coords=[]
        # print("--"*40)
        # print(f"{dir_json['coords']} {len(dir_json['coords'])}")
        # for i in range(len(dir_json['coords'])):
        #     coords.append([dir_json['coords'][i][1],dir_json['coords'][i][0]])
        # print("=="*40)        
        # print(coords)
        return cls(dir_json['origin'],dir_json['destination'],dir_json['duration'],dir_json['distance'],dir_json['avg_speed'],dir_json['coords'],None)

    def cre_trip_data(self):
        self.prep_trip_data()
        self.kdb.ins_row(self.trip_data)
        return self.trip_data
    

    def get_all_trips(self):
        print(f'-------------------Trips.get_trip_details------------------------')
        trip_details=[]
        for pts in self.kdb.get_all_trips():
            print("#"*80)
            pprint.pprint(pts)
            trip_details=pts
        return trip_details


    def get_trip_details(self,p_trip_id):
        trip_details=None
        print(f'-------------------Trips.get_trip_details------------------------')
        print("o"*80)
        for pts in self.kdb.get_trip_details(p_trip_id):
            pprint.pprint(pts)
            print("a"*80)
            # print(pts['coords'])
            print(pts['coords'])
            # pts['coords']=pts['coords']
            trip_details=pts
        return trip_details
    

if __name__=="__main__":
    # trip=Trips.cre_trip("Molly","Holly",800,500,4.3,[[1,2],[3,4],[1,2],[3,4],[1,2],[3,4]])
    inp_json={
        "origin":"Molly",
        "destination":"Holly",
        "distance":800,
        "duration":500,
        "avg_speed":4.3,
        "coords":[[1,2],[3,4],[1,2],[3,4],[1,2],[3,4]]
    }
    trip=Trips.cre_trip(inp_json)
    trip.cre_trip_data()
    pprint.pprint(trip.trip_data)
    trip.get_trip_details('T-0718')