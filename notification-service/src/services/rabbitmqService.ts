import amqp, { Channel } from 'amqplib';
import { RABBITMQ_URL } from '../config/rabbitmqConfig';

export const createRabbitMQConnection = async (): Promise<any> => {
  return amqp.connect(RABBITMQ_URL);
};

export const createRabbitMQChannel = async (connection: any): Promise<Channel> => {
  return connection.createChannel();
};
