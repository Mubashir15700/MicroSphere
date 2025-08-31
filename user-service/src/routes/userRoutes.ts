import { Router } from 'express';
import {
  verifyToken,
  requireAdmin,
  validateServiceSecretOrAdmin,
} from '../middlewares/authMiddleware';
import {
  createUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUsers,
} from '../controllers/userController';

const router = Router();

router.post('/', validateServiceSecretOrAdmin, createUser);
router.get('/email/:email', validateServiceSecretOrAdmin, getUserByEmail);
router.get('/', verifyToken, requireAdmin, getAllUsers);
router.get('/userId/:id', verifyToken, getUserById);
router.put('/userId/:id', verifyToken, updateUser);
router.delete('/', verifyToken, requireAdmin, deleteUsers);

export default router;
