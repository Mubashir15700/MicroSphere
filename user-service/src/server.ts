import app from './app';
import { PORT, MONGO_URI } from './config/envConfig';
import { connectDB, disconnectDB } from './config/dbConfig';
import { logger } from './utils/logger';

function handleGracefulShutdown(server: any) {
  ['SIGINT', 'SIGTERM'].forEach(signal =>
    process.on(signal, async () => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      try {
        await disconnectDB();
        logger.info('MongoDB connection closed.');
      } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
      }

      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    })
  );

  process.on('unhandledRejection', reason => {
    logger.error('Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', err => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
  });
}

(async () => {
  try {
    await connectDB(MONGO_URI);

    const server = app.listen(PORT, () => {
      logger.info(`User service listening on port ${PORT}`);
    });

    handleGracefulShutdown(server);
  } catch (err) {
    logger.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit process so container/orchestrator restarts it
  }
})();
