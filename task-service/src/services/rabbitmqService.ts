import amqp, { Channel } from "amqplib";
import {
  RABBITMQ_URL,
  TASK_QUEUE_NAME,
  RABBITMQ_RETRY_COUNT,
  RABBITMQ_RETRY_DELAY,
} from "../config/envConfig";

let connection: any | null = null;
let channel: Channel | null = null;

export async function connectToRabbitMQ() {
  let retries = RABBITMQ_RETRY_COUNT;

  while (retries) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel!.assertQueue(TASK_QUEUE_NAME);
      console.log("Connected to RabbitMQ");
      break;
    } catch (err) {
      console.error("Could not connect to RabbitMQ", err);
      retries--;
      console.log(`Retries left: ${retries}`);
      await new Promise((res) => setTimeout(res, RABBITMQ_RETRY_DELAY));
    }
  }
}

export function getChannel() {
  if (!channel) throw new Error("RabbitMQ channel is not initialized");
  return channel;
}

export function getQueueName() {
  return TASK_QUEUE_NAME;
}
