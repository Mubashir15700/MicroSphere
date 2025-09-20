import redisClient from '../services/redisService';
import logger from './logger';

const clearCache = async () => {
  try {
    await redisClient.del('notifications:all');
    logger.info('Notification cache cleared');
  } catch (err) {
    logger.error(`Failed to clear notification cache: ${err}`);
  }
};

export default clearCache;
