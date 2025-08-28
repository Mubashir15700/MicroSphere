const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const amqp = require("amqplib");

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://mongo:27017/taskDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", TaskSchema);

let channel, connection;

async function connectToRabbitMQ(retries = 5, delay = 5000) {
  while (retries) {
    try {
      connection = await amqp.connect("amqp://rabbitmq");
      channel = await connection.createChannel();
      await channel.assertQueue("taskQueue");
      console.log("Connected to RabbitMQ");
      break;
    } catch (err) {
      console.error("Could not connect to RabbitMQ", err);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

app.get("/", (req, res) => {
  res.send("Task Service is running");
});

app.post("/tasks", async (req, res) => {
  const { title, description, userId } = req.body;

  const task = new Task({
    title,
    description,
    userId,
  });

  try {
    await task.save();

    if (channel) {
      channel.sendToQueue(
        "taskQueue",
        Buffer.from(JSON.stringify({ taskId: task._id, userId }))
      );
      console.log("Message sent to RabbitMQ");
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Task Service listening on port ${port}`);
  connectToRabbitMQ();
});

module.exports = app;
