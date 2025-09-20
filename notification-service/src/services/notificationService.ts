import prisma from '../prisma';
import clearCache from '../utils/cache';
import logger from '../utils/logger';

export const createNotification = async (userId: string, message: string, type: string) => {
  try {
    const notification = await prisma.notification.create({
      data: { userId, message, type },
    });
    clearCache();
    return notification;
  } catch (err) {
    logger.error(`Failed to create notification: ${err}`);
    throw err;
  }
};

export const deleteOldNotifications = async () => {
  try {
    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
      },
    });
    clearCache();
    logger.info(`Deleted ${result.count} old notifications.`);
  } catch (err) {
    logger.error(`Failed to delete old notifications: ${err}`);
  }
};
