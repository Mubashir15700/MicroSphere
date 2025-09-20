import redisClient from '../services/redisService';
import logger from './logger';

const clearCache = async () => {
  try {
    await redisClient.del('tasks:all');
    logger.info('Task cache cleared');
  } catch (err) {
    logger.error(`Failed to clear task cache: ${err}`);
  }
};

export default clearCache;
