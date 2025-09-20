import amqp, { Channel } from 'amqplib';
import { QUEUE_NAMES, RABBITMQ_URL, RETRY_COUNT, RETRY_DELAY } from '../config/rabbitmqConfig';
import startConsuming from '../consumers/notificationConsumer';
import logger from '../utils/logger';

let connection: any | null = null;
let channel: Channel | null = null;

const connectToRabbitMQ = async (): Promise<void> => {
  let retries = RETRY_COUNT;

  while (retries > 0) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      logger.info('Notification Service connected to RabbitMQ');

      if (!channel) throw new Error('Channel is not created');

      for (const queueName of QUEUE_NAMES) {
        startConsuming(channel, queueName.name);
      }

      return; // success, exit retry loop
    } catch (err: any) {
      logger.error(`Failed to connect to RabbitMQ. Retries left: ${retries}`);
      logger.error(`Reason: ${err.message}`);
      retries -= 1;

      if (retries === 0) {
        logger.error('Giving up. Exiting.');
        process.exit(1);
      }

      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

export const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  return channel;
};

export const getQueueName = (key: string) => {
  return QUEUE_NAMES.find(q => q.key === key)?.name || '';
};

export default connectToRabbitMQ;
