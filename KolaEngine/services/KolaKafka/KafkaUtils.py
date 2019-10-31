from kafka import KafkaProducer as KP
from kafka import KafkaConsumer

class KafkaUtils(object):
    def __init__(self,topic=None):
        self.k_prod=None
        self.topic=topic
        self.k_consumer=None

    def test(self):
        print("Test in kafkaUtils ")
        
    def connect_kafka_producer(self):
        try:
            self.k_prod=KP(bootstrap_servers=['localhost:9092'])
        except Exception as ex:
            print('Error while connecting to Kafka Producer')
            print(ex)
    
    def connect_kafka_consumer(self):
        try:
            print(f'Kafka Consumer connect called for {self.topic}')
            self.k_consumer=KafkaConsumer(self.topic,auto_offset_reset='latest',
                                          bootstrap_servers=['localhost:9092'],
                                          enable_auto_commit=True,
                                          auto_commit_interval_ms=1000,
                                          group_id='KolaConGrp')
        except Exception as ex:
            print('Error Connecting to Kafka Consumer')
            print(ex)

    def publish_message(self,key,value):
        status=None
        try:
            print(f'Publish Message Key : {key}, Type: {type(key)}')
            print(f'Publish Message Value: {value}, Type: {type(value)}')
            key_b=bytes(key,encoding='utf-8')
            value_b=bytes(str(value),encoding='utf-8')
            self.k_prod.send(topic=self.topic,key=key_b,value=value_b)
            self.k_prod.flush()
            status=True
        except Exception as ex:
            print("Error while publishing message")
            print(ex)
            status=False
        finally:
            return status
        
    def close_connect_kafka_producer(self):
        try:
            self.k_prod.close()
        except Exception as ex:
            print("Error while closing kafka producer Connection")
            print(ex)

    