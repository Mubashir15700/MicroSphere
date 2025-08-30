import { Router, Request, Response } from 'express';
import { Task } from '../models/taskModel';
import { getChannel, getQueueName } from '../services/rabbitmqService';
import { verifyToken } from '../middlewares/authMiddleware';
import { logger } from '../utils/logger';

const router = Router();

// Create task
router.post('/', verifyToken, async (req: Request, res: Response) => {
  const { title, description, userId } = req.body;

  try {
    const task = new Task({ title, description, userId });
    await task.save();

    const channel = getChannel();
    channel.sendToQueue(getQueueName(), Buffer.from(JSON.stringify({ taskId: task._id, userId })));
    logger.info('Message sent to RabbitMQ');

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tasks (admin / debug)
router.get('/', verifyToken, async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks of a specific user
router.get('/user/:userId', verifyToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Find one task by ID
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update task status
router.patch('/:id/status', verifyToken, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
