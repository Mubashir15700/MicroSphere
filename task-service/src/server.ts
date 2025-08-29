import mongoose from "mongoose";
import app from "./app";
import { connectToRabbitMQ } from "./services/rabbitmqService";
import { PORT, MONGO_URI } from "./config/envConfig";
import { logger } from "./utils/logger";

function handleGracefulShutdown(server: any) {
  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, async () => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed.");
        logger.info("Server closed.");
        process.exit(0);
      });
    })
  );

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", reason);
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
    process.exit(1);
  });
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info("Connected to MongoDB");

    const server = app.listen(PORT, async () => {
      logger.info(`Task Service listening on port ${PORT}`);
      try {
        await connectToRabbitMQ();
        logger.info("Connected to RabbitMQ");
      } catch (err) {
        logger.error("Failed to connect to RabbitMQ", err);
        process.exit(1);
      }
    });

    handleGracefulShutdown(server);
  })
  .catch((err) => {
    logger.error("Could not connect to MongoDB", err);
    process.exit(1);
  });
