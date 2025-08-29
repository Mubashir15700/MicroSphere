import app from "./app";
import { PORT } from "./config/envConfig";
import { logger } from "./utils/logger";

const server = app.listen(PORT, () => {
  logger.info(`API Gateway listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});

// Optional: Handle unexpected crashes
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
