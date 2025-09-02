import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Channel } from 'amqplib';
import Task from '../models/taskModel';
import { getChannel, getQueueName } from '../services/rabbitmqService';
import { getUserByID } from '../services/userService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import logger from '../utils/logger';
import handleError from '../utils/errorHandler';

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

const sendToQueue = async (channel: Channel, message: any) => {
  try {
    await channel.sendToQueue(
      getQueueName(),
      Buffer.from(message),
      { persistent: true } // Ensure message is not lost in case of failure
    );
    logger.info('Message sent to RabbitMQ');
  } catch (error) {
    logger.error('Error sending to RabbitMQ', error);
    // Retry logic or send to a dead-letter queue
  }
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
      const message = {
        taskId: task._id,
        assigneeId,
        action: 'create',
      };

      try {
        const channel = getChannel();
        await sendToQueue(channel, JSON.stringify(message));
      } catch (rabbitmqError: any) {
        logger.error(`RabbitMQ error during task creation: ${rabbitmqError.message}`);
      }
    }

    res.status(201).json(task);
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'Task with this title already exists.' });
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

export const getTasksByUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (req.user && req.user.role !== 'admin' && req.user.id !== userId) {
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

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAdmin = req.user?.role === 'admin';
    const isAssignee = task.assigneeId?.toString() === req.user?.id;

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ message: 'Access denied. You are not the assignee.' });
    }

    const allowedFields = isAdmin
      ? ['title', 'description', 'dueDate', 'status', 'assigneeId']
      : ['status'];

    const updates = req.body;
    const invalidFields = Object.keys(updates).filter(key => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
      return res.status(400).json({ message: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    if (updates.status && !['pending', 'in-progress', 'completed'].includes(updates.status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Apply allowed updates
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        (task as any)[field] = updates[field];
      }
    });

    const wasAssigneeChanged =
      isAdmin && updates.assigneeId && updates.assigneeId !== task.assigneeId?.toString();

    const updatedTask = await task.save();

    // Send message to queue after successful save
    if (wasAssigneeChanged) {
      const assignee = await getUserByID(req, updates.assigneeId);
      if (!assignee) {
        return res.status(404).json({ message: 'Assignee not found' });
      }

      const message = {
        taskId: task._id,
        assigneeId: updates.assigneeId,
        action: 'update',
      };

      try {
        const channel = getChannel();
        await sendToQueue(channel, JSON.stringify(message));
      } catch (rabbitmqError: any) {
        logger.error(`RabbitMQ error during task update: ${rabbitmqError.message}`);
      }
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask.toObject({ versionKey: false }),
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
