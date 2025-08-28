import dotenv from "dotenv";
import amqp, { Channel, ConsumeMessage } from "amqplib";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
const QUEUE_NAME = process.env.QUEUE_NAME || "taskQueue";
const RETRY_COUNT = parseInt(process.env.RETRY_COUNT as string) || 10;
const RETRY_DELAY = parseInt(process.env.RETRY_DELAY as string) || 5000;

async function connectRabbitMQ(
  retries: number = RETRY_COUNT,
  delay: number = RETRY_DELAY
): Promise<void> {
  while (retries > 0) {
    try {
      const connection: any = await amqp.connect(RABBITMQ_URL);
      const channel: Channel = await connection.createChannel();

      await channel.assertQueue(QUEUE_NAME);
      console.log("Notification Service connected to RabbitMQ");

      channel.consume(QUEUE_NAME, (msg: ConsumeMessage | null) => {
        if (msg === null) {
          return;
        }

        console.log("Received message:", msg.content.toString());
        channel.ack(msg);
      });

      return; // Exit loop on successful connection
    } catch (err: any) {
      console.error(`Failed to connect to RabbitMQ. Retries left: ${retries}`);
      console.error("Reason:", err.message);
      retries -= 1;

      if (retries === 0) {
        console.error("Giving up. Exiting.");
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

connectRabbitMQ();
