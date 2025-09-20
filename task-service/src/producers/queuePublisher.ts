import { Channel } from 'amqplib';
import { getQueueName } from '../services/rabbitmqService';
import logger from '../utils/logger';

const sendToQueue = async (channel: Channel, message: any) => {
  try {
    await channel.sendToQueue(
      getQueueName(),
      Buffer.from(message),
      { persistent: true } // Ensure message is not lost in case of failure
    );
    logger.info(`Message sent to RabbitMQ: ${message}`);
  } catch (error) {
    logger.error(`Error sending to RabbitMQ: ${error}`);
    // Retry logic or send to a dead-letter queue
  }
};

export default sendToQueue;
