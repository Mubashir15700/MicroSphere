import mongoose from 'mongoose';
import logger from '../utils/logger';

export const connectDB = async (MONGO_URI: string) => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(`Could not connect to MongoDB: ${error}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error(`Could not disconnect from MongoDB: ${error}`);
  }
};
