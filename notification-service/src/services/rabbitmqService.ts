import amqp, { Channel } from 'amqplib';
import { RABBITMQ_URL } from '../config/rabbitmqConfig';

export async function createRabbitMQConnection(): Promise<any> {
  return amqp.connect(RABBITMQ_URL);
}

export async function createRabbitMQChannel(connection: any): Promise<Channel> {
  return connection.createChannel();
}
