import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/taskModel';
import { getChannel, getQueueName } from '../services/rabbitmqService';
import { getUserByID } from '../services/userService';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, assigneeId } = req.body;

  let validAssigneeId: mongoose.Types.ObjectId | undefined;
  try {
    if (assigneeId) {
      const response = await getUserByID(req, assigneeId);

      if (!response.email) {
        return res.status(404).json({ message: 'User not found' });
      }
      validAssigneeId = new mongoose.Types.ObjectId(assigneeId);
    }

    const task = new Task({
      title,
      description,
      ...(validAssigneeId && { assigneeId: validAssigneeId }),
    });
    await task.save();

    if (validAssigneeId) {
      const channel = getChannel();
      channel.sendToQueue(
        getQueueName(),
        Buffer.from(JSON.stringify({ taskId: task._id, assigneeId }))
      );
      logger.info('Message sent to RabbitMQ');
    }

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

export const getTasksByUser = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const user = await getUserByID(req, userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tasks = await Task.find({ assigneeId: userId }).sort({ createdAt: -1 });

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for the user' });
    }

    res.json(tasks);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const updateTask = async (req: any, res: Response) => {
  try {
    const updates = req.body;
    const allowedFields =
      req.user.role === 'admin'
        ? ['title', 'description', 'dueDate', 'status', 'assigneeId']
        : ['status'];
    const invalidFields = Object.keys(updates).filter(key => !allowedFields.includes(key));

    if (invalidFields.length > 0) {
      return res.status(400).json({ message: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    if (updates.status && !['pending', 'in-progress', 'completed'].includes(updates.status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only admin OR the assigned user can update
    if (req.user.role !== 'admin') {
      if (!task.assigneeId) {
        return res.status(403).json({ message: 'Task is unassigned. Only admins can update.' });
      }

      if (task.assigneeId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied. You are not the assignee.' });
      }
    }

    Object.keys(updates).forEach(key => {
      (task as any)[key] = updates[key];
    });

    const updatedTask = await task.save();
    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask.toObject(),
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const deleteTasks = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    let result;
    if (id) {
      if (!isValidObjectId(id as string)) {
        return res.status(400).json({ message: 'Invalid task ID' });
      }

      result = await Task.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      const deleteResult = await Task.deleteMany({});
      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: 'No tasks found to delete' });
      }
      return res
        .status(200)
        .json({ message: `${deleteResult.deletedCount} tasks have been deleted.` });
    }
  } catch (error: any) {
    handleError(res, error);
  }
};
