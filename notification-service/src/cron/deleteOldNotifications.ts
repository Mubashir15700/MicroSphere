import cron from 'node-cron';
import { deleteOldNotifications } from '../services/notificationService';
import { NODE_ENV } from '../config/envConfig';
import logger from '../utils/logger';

// Schedule a cron job to delete notifications older than 7 days
const interval = NODE_ENV === 'test' ? '*/5 * * * *' : '0 0 * * *'; // Every 5 minutes for test, daily at midnight otherwise

cron.schedule(interval, async () => {
  logger.info('Running cron job to delete old notifications');
  await deleteOldNotifications();
});
