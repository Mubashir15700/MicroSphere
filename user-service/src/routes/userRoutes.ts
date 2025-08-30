import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import {
  createUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  deleteAllUsers,
} from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/email/:email', getUserByEmail);
router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.delete('/', verifyToken, deleteAllUsers);

export default router;
