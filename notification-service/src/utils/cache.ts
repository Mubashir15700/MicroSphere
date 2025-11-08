import redisClient from '../services/redisService';
import logger from './logger';

const clearCache = async () => {
  try {
    const pattern = 'notifications:user:*';
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Deleted ${keys.length} notification cache keys`);
    } else {
      logger.info('No notification cache keys to delete');
    }
  } catch (err) {
    logger.error(`Failed to clear notification cache: ${err}`);
  }
};

export default clearCache;
