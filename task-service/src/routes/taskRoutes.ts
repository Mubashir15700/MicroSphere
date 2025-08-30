import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import {
  createTask,
  getAllTasks,
  getTasksByUser,
  getTaskById,
  updateTaskStatus,
  deleteAllTasks,
} from '../controllers/taskController';

const router = Router();

router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getAllTasks);
router.get('/user/:userId', verifyToken, getTasksByUser);
router.get('/:id', verifyToken, getTaskById);
router.patch('/:id/status', verifyToken, updateTaskStatus);
router.delete('/', verifyToken, deleteAllTasks);

export default router;
