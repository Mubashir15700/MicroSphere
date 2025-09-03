import { Channel, ConsumeMessage } from 'amqplib';
import logger from '../utils/logger';

const startConsuming = (channel: Channel, queueName: string) => {
  channel
    .assertQueue(queueName, { durable: true })
    .then(() => {
      logger.info(`Waiting for messages in queue: ${queueName}`);
      channel.consume(queueName, (msg: ConsumeMessage | null) => {
        if (!msg) return;

        const message = msg.content.toString();
        logger.info(`Received message: ${message}`);

        // Process the message here (e.g., send notification, update DB, etc.)
        switch (queueName) {
          case 'taskQueue':
            // Handle taskQueue message
            break;
          case 'userQueue':
            // Handle userQueue message
            break;
          default:
            logger.info(`No handler defined for queue: ${queueName}`);
        }

        channel.ack(msg);
      });
    })
    .catch(err => {
      logger.error(`Error asserting queue "${queueName}":`, err);
    });
};

export default startConsuming;
