import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { handleError } from '../utils/errorHandler';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User(req.body);

    await user.save();

    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'Email already in use' });
    }
    handleError(res, error);
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await User.deleteMany({});

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No users found to delete' });
    }

    res.status(200).json({ message: `${result.deletedCount} users have been deleted.` });
  } catch (error: any) {
    handleError(res, error);
  }
};
