import { QUEUE_NAME, RETRY_COUNT, RETRY_DELAY } from './config/rabbitmqConfig';
import { createRabbitMQConnection, createRabbitMQChannel } from './services/rabbitmqService';
import startConsuming from './consumers/notificationConsumer';
import logger from './utils/logger';

const connectRabbitMQ = async (retries = RETRY_COUNT, delay = RETRY_DELAY): Promise<void> => {
  while (retries > 0) {
    try {
      const connection = await createRabbitMQConnection();
      const channel = await createRabbitMQChannel(connection);

      logger.info('Notification Service connected to RabbitMQ');

      startConsuming(channel, QUEUE_NAME);

      return; // success, exit retry loop
    } catch (err: any) {
      logger.error(`Failed to connect to RabbitMQ. Retries left: ${retries}`);
      logger.error('Reason:', err.message);
      retries -= 1;

      if (retries === 0) {
        logger.error('Giving up. Exiting.');
        process.exit(1);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

connectRabbitMQ();
