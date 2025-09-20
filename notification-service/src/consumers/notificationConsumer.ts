import { Channel, ConsumeMessage } from 'amqplib';
import prisma from '../prisma';
import logger from '../utils/logger';

const startConsuming = (channel: Channel, queueName: string) => {
  channel
    .assertQueue(queueName, { durable: true })
    .then(() => {
      logger.info(`Waiting for messages in queue: ${queueName}`);
      channel.consume(queueName, async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        const message = msg.content.toString();
        logger.info(`Received message: ${message}`);

        // Process the message here (e.g., send notification, update DB, etc.)
        switch (queueName) {
          case 'taskQueue':
            // Handle taskQueue message
            await prisma.notification.create({
              data: {
                userId: JSON.parse(message).userId || '',
                message: JSON.parse(message).message || '',
                type: 'task',
              },
            });
            break;
          case 'userQueue':
            // Handle userQueue message
            await prisma.notification.create({
              data: {
                userId: JSON.parse(message).userId || '',
                message: JSON.parse(message).message || '',
                type: 'user',
              },
            });
            break;
          default:
            logger.info(`No handler defined for queue: ${queueName}`);
        }

        channel.ack(msg);
      });
    })
    .catch(err => {
      logger.error(`Error asserting queue "${queueName}": ${err}`);
    });
};

export default startConsuming;
