import { Channel, ConsumeMessage } from 'amqplib';
import { createNotification } from '../services/notificationService';
import { getIO } from '../socket';
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

          try {
            const io = getIO();
            io.to(userId).emit('notification:new', {
              title: 'New Notification',
              message: msgText,
              type: queueName === 'taskQueue' ? 'task' : 'user',
              createdAt: new Date(),
            });
            logger.info(`Real-time notification sent to user ${userId}`);
          } catch (socketErr: any) {
            logger.error(`Socket.IO emit error: ${socketErr.message}`);
          }

          channel.ack(msg);
        } catch (err) {
          logger.error(`Failed to process notification: ${err}`);
          channel.nack(msg, false, false); // Optionally requeue
        }
      });
    })
    .catch(err => {
      logger.error(`Error asserting queue "${queueName}": ${err}`);
    });
};

export default startConsuming;
