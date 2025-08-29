import { Router, Request, Response } from "express";
import { Task } from "../models/taskModel";
import { getChannel, getQueueName } from "../services/rabbitmqService";
import { logger } from "../utils/logger";

const router = Router();

router.get("/test", (_req: Request, res: Response) => {
  res.send("Task Service is running");
});

router.post("/", async (req: Request, res: Response) => {
  const { title, description, userId } = req.body;

  try {
    const task = new Task({ title, description, userId });
    await task.save();

    const channel = getChannel();
    channel.sendToQueue(
      getQueueName(),
      Buffer.from(JSON.stringify({ taskId: task._id, userId }))
    );
    logger.info("Message sent to RabbitMQ");

    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
