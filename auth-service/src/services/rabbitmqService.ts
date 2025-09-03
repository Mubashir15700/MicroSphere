import amqp, { Channel } from 'amqplib';
import {
  RABBITMQ_URL,
  USER_QUEUE_NAME,
  RABBITMQ_RETRY_COUNT,
  RABBITMQ_RETRY_DELAY,
} from '../config/envConfig';
import logger from '../utils/logger';

let connection: any | null = null;
let channel: Channel | null = null;

export const connectToRabbitMQ = async () => {
  let retries = RABBITMQ_RETRY_COUNT;

  while (retries) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel!.assertQueue(USER_QUEUE_NAME, { durable: true });
      logger.info('Connected to RabbitMQ');
      break;
    } catch (err) {
      logger.error('Could not connect to RabbitMQ', err);
      retries--;
      logger.info(`Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, RABBITMQ_RETRY_DELAY));
    }
  }
};

export const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  return channel;
};

export const getQueueName = () => {
  return USER_QUEUE_NAME;
};
