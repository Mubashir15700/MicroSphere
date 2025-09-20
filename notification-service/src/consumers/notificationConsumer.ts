import { Channel, ConsumeMessage } from 'amqplib';
import { createNotification } from '../services/notificationService';
import logger from '../utils/logger';

const startConsuming = (channel: Channel, queueName: string) => {
  channel
    .assertQueue(queueName, { durable: true })
    .then(() => {
      logger.info(`Waiting for messages in queue: ${queueName}`);
      channel.consume(queueName, async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        const raw = msg.content.toString();
        logger.info(`Received message: ${raw}`);

        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          logger.error(`Invalid JSON format: ${err}`);
          return channel.nack(msg, false, false); // Don't requeue malformed messages
        }

        const { userId = '', message: msgText = '' } = data;

        if (!userId || !msgText) {
          logger.warn(`Missing userId or message in payload: ${raw}`);
          return channel.nack(msg, false, false);
        }

        try {
          await createNotification(userId, msgText, queueName === 'taskQueue' ? 'task' : 'user');
          channel.ack(msg);
        } catch (err) {
          logger.error(`Failed to create notification: ${err}`);
          channel.nack(msg, false, false); // Optionally requeue
        }
      });
    })
    .catch(err => {
      logger.error(`Error asserting queue "${queueName}": ${err}`);
    });
};

export default startConsuming;
