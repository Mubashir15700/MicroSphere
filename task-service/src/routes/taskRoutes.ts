import { Router } from 'express';
import { verifyToken, requireAdmin } from '../middlewares/authMiddleware';
import {
  createTask,
  getAllTasks,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTasks,
} from '../controllers/taskController';

const router = Router();

router.post('/', verifyToken, requireAdmin, createTask);
router.get('/', verifyToken, getAllTasks);
router.get('/user/:userId', verifyToken, getTasksByUser);
router.get('/:id', verifyToken, getTaskById);
router.put('/:id', verifyToken, updateTask);
router.delete('/', verifyToken, requireAdmin, deleteTasks);

export default router;
