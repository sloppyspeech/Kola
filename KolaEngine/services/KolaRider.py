from kafka import KafkaConsumer
from services.KolaKafka.KafkaUtils import KafkaUtils
import time
import pprint

class KolaRider(object):
    def __init__(self):
        self.kc=KafkaUtils('kola01')
        self.kc.connect_kafka_consumer()
        self.kafkaConn=self.kc.k_consumer
        print(self.kafkaConn)

    def simu_rider(self):
        print('============simu_rider=============')
        # print(self.kafkaConn.items())
        for msg in self.kafkaConn:
            print('-'*50)
            time.sleep(2)
            print(msg)
            # print(f"Kafka Consumer Key {dir(msg)}")
            print(f"Kafka Consumer Key {msg.key.decode('utf-8')}")
            print(f"Kafka Consumer Message {msg.value.decode('utf-8')}")
            print(f"Kafka Consumer Offset {msg.offset}")
            print(f"Kafka Consumer topic {msg.topic}")
            print(f"Kafka Consumer Partition {msg.partition}")
        return {"key":msg.key.decode('utf-8'),"value":msg.value.decode('utf-8')}