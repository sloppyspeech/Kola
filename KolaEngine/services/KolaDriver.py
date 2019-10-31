from kafka import KafkaProducer
from kafka import KafkaClient as KC
import services.KolaDirections as KD
from services.KolaKafka.KafkaUtils import KafkaUtils
import statistics as st
import time
import pprint

class KolaDriver(object):
    """Manage Driver actions
    """
    def __init__(self,trip_json):
        print(f'Koladriver Init')
        print('9'*80)
        pprint.pprint(trip_json)
        self.origin=trip_json['origin']
        # self.pickup_loc=trip_json.pickup_loc
        self.destination=trip_json['destination']
        # self.kafkaUtils=KU.KafkaUtils()
        self.driver_id=trip_json['DriverId']
        self.rider_id=trip_json['Riders']
        self.distance=trip_json['distance']
        # self.dirs_topickup_pt=KD.KolaDirections(driver_id=self.driver_id,rider_id=self.rider_id,origin=self.origin,destination=self.pickup_loc)
        # self.dirs_todest=KD.KolaDirections(driver_id=self.driver_id,rider_id=self.rider_id,origin=self.pickup_loc,destination=self.destination)
        self.coords=trip_json['coords']
        # self.dtpkup_speed=self.dirs_topickup_pt.speed
        self.avg_speed=trip_json['avg_speed']
        self.duration=trip_json['duration']
        self.no_of_cords=len(trip_json['coords'])
        self.trip_id=trip_json['TripId']

    # @classmethod
    # def cre_test_trip(cls,origin,pickup_loc,destination,driver_id=None,rider_id=None):
    #     self.origin=origin
    #     self.pickup_loc=pickup_loc
    #     self.destination=destination
    #     self.kafkaUtils=KU.KafkaUtils()
    #     self.driver_id=1
    #     self.rider_id=2
    #     self.dirs_topickup_pt=KD.KolaDirections(driver_id=self.driver_id,rider_id=self.rider_id,origin=self.origin,destination=self.pickup_loc)
    #     # self.dirs_todest=KD.KolaDirections(driver_id=self.driver_id,rider_id=self.rider_id,origin=self.pickup_loc,destination=self.destination)
    #     self.dtpkup_coords=self.dirs_topickup_pt.route_coords
    #     self.dtpkup_speed=self.dirs_topickup_pt.speed
    #     self.dtpkup_avg_speed=self.dirs_topickup_pt.avg_speed
    #     self.dtpkup_duration=self.dirs_topickup_pt.duration
    #     self.dtpkup_no_of_cords=self.dirs_topickup_pt.no_of_coords

    def get_dirs_to_pickup_pt(self):
        """Directions from Origin to Pickup 
        
        Returns:
            [type] -- [description]
        """
        print('In KolaDriver get_dirs_to_pikup_pt')
        print('-'*80)
        # return self.dirs_topickup_pt
    
        
    def simu_driver_mvmnt(self):
        """Simulate publishing, current location of the driver.
           The interval of update depends on num of Coordinates between origin and destination
        """
        print('-'*80)
        print('Producer Simu Driver')
        print(f'Producer Duration : {self.duration}')
        print(f'Producer num coords : {self.coords}')
        print(f'Producer num coords : {len(self.coords)}')
        print(f'producer num coords : {self.no_of_cords}')
        # print(f'{self.coords}')
        # print(f'{type(self.coords)}')
        # print(f'{eval(self.coords)}')
        # print(f'{type(eval(self.coords))}')
        cntr=0
        num_cords=0
        iter=0
        skip_size=self.duration/self.no_of_cords
        print(f'Producer skip_size :{skip_size}')
        KP=KafkaUtils(topic='kola01')
        KP.connect_kafka_producer()
        while(num_cords<len(self.coords)):
            print(f'{cntr} : {self.avg_speed}')
            if cntr >skip_size:
                print(f'Before Kafka Publish Message :{self.coords[iter]}')
                KP.publish_message(key=f'{self.trip_id}:{iter}',value=self.coords[iter])
                cntr=1
                num_cords+=1
                iter+=1
            # time.sleep(3)
            cntr+=1
        print(f'{self.coords[len(self.coords)-1]}')
        KP.connect_kafka_producer()
    
    



