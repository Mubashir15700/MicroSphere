const amqp = require("amqplib");

async function connectRabbitMQ(retries = 10, delay = 5000) {
  while (retries) {
    try {
      const connection = await amqp.connect("amqp://rabbitmq");
      const channel = await connection.createChannel();
      await channel.assertQueue("taskQueue");

      console.log("Notification Service connected to RabbitMQ");

      channel.consume("taskQueue", (msg) => {
        console.log("Received message:", msg.content.toString());
        channel.ack(msg);
      });

      return; // Exit loop on successful connection
    } catch (err) {
      console.error(
        `Failed to connect to RabbitMQ. Retries left: ${retries}`
      );
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
