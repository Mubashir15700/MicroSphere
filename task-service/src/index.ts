import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import amqp, { Channel } from "amqplib";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/taskDB";
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";
const TASK_QUEUE_NAME = process.env.TASK_QUEUE_NAME || "taskQueue";
const RABBITMQ_RETRY_COUNT =
  parseInt(process.env.RABBITMQ_RETRY_COUNT as string) || 5;
const RABBITMQ_RETRY_DELAY =
  parseInt(process.env.RABBITMQ_RETRY_DELAY as string) || 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: any) => {
    console.error("Could not connect to MongoDB", err);
  });

interface ITask extends Document {
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model<ITask>("Task", TaskSchema);

let channel: Channel | null = null;
let connection: any;

async function connectToRabbitMQ(
  retries = RABBITMQ_RETRY_COUNT,
  delay = RABBITMQ_RETRY_DELAY
): Promise<void> {
  while (retries) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel!.assertQueue(TASK_QUEUE_NAME);
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

app.get("/test", (_req: Request, res: Response) => {
  res.send("Task Service is running");
});

app.post("/", async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/", async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Task Service listening on port ${PORT}`);
  connectToRabbitMQ();
});

module.exports = app;
