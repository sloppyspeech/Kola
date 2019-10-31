from influxdb import InfluxDBClient 
import pprint

class DB(object):
    """Main InfluxDB Class to handle normal db activities
    
    Arguments:
        Object {[type]} -- [description]
    
    Returns:
        [type] -- [description]
    """
    def __init__(self):
        self.infcli=InfluxDBClient(host='localhost', port=8086,database='Kola')
        self.db_list=None
        self.measurement=None
    
    def ins_row(self,p_data):
        """Insert a Point(Row) in influxDB
        }
        Arguments:
            p_data {[type]} -- [description]
        """
        pprint.pprint(p_data)
        self.infcli.write_points(p_data)

    def get_trip_details(self,p_where):
        bind_params={'TripId':p_where}
        return self.infcli.query("Select * from Kola.autogen.TripMaster Where TripId=$TripId;",bind_params=bind_params).get_points()


    def get_all_trips(self):
        return self.infcli.query('Select DriverId,TripId,Riders,avg_speed,origin,destination,distance,"duration"  from Kola.autogen.TripMaster;')

    def del_row(self,p_which):
        pass

    def chk_db_exist(self,p_which):
        if (len(list(filter(lambda v:(v["name"]==p_which),self.db_list))) ==0):
            return True
        else:
            return False

    def cre_db(self,p_name):
        self.infcli.create_database(p_name)

    def drp_db(self,p_name):
        self.infcli.drop_database(p_name)

    def list_db(self):
        self.db_list=self.infcli.get_list_database()

    def switch_db(self,p_name):
        if (self.chk_db_exist(p_name)):
            self.cre_db(p_name)
        else:
            self.infcli.switch_database(p_name)


if __name__=='__main__':
    pass