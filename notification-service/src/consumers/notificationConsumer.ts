import { Channel, ConsumeMessage } from "amqplib";

export function startConsuming(channel: Channel, queueName: string) {
  channel
    .assertQueue(queueName)
    .then(() => {
      console.log(`Waiting for messages in queue: ${queueName}`);
      channel.consume(queueName, (msg: ConsumeMessage | null) => {
        if (!msg) return;

        console.log("Received message:", msg.content.toString());
        // Process the message here (e.g., send notification, update DB, etc.)

        channel.ack(msg);
      });
    })
    .catch((err) => {
      console.error("Error asserting queue:", err);
    });
}
