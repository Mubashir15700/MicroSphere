import { Channel, ConsumeMessage } from "amqplib";
import { logger } from "../utils/logger";

export function startConsuming(channel: Channel, queueName: string) {
  channel
    .assertQueue(queueName)
    .then(() => {
      logger.info(`Waiting for messages in queue: ${queueName}`);
      channel.consume(queueName, (msg: ConsumeMessage | null) => {
        if (!msg) return;

        logger.info("Received message:", msg.content.toString());
        // Process the message here (e.g., send notification, update DB, etc.)

        channel.ack(msg);
      });
    })
    .catch((err) => {
      logger.error("Error asserting queue:", err);
    });
}
