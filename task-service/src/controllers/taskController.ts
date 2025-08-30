import { Request, Response } from 'express';
import { Task } from '../models/taskModel';
import { getChannel, getQueueName } from '../services/rabbitmqService';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

export const createTask = async (req: Request, res: Response) => {
  const { title, description, userId } = req.body;

  try {
    const task = new Task({ title, description, userId });
    await task.save();

    const channel = getChannel();
    channel.sendToQueue(getQueueName(), Buffer.from(JSON.stringify({ taskId: task._id, userId })));
    logger.info('Message sent to RabbitMQ');

    res.status(201).json(task);
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'Task with this title already exists for the user.' });
    }
    handleError(res, error);
  }
};

export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getTasksByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const deleteAllTasks = async (req: Request, res: Response) => {
  try {
    const result = await Task.deleteMany({});

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No tasks found to delete' });
    }

    res.status(200).json({ message: `${result.deletedCount} tasks have been deleted.` });
  } catch (error: any) {
    handleError(res, error);
  }
};
