import { register, login } from '../src/controllers/authController';
import * as userService from '../src/services/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../src/services/userService');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return 400 if fields are missing', async () => {
      const req: any = { body: { email: '', password: '', name: '' } };
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Name, email and password required',
      });
    });

    it('should create user and return token', async () => {
      const req: any = {
        body: {
          name: 'Jane',
          email: 'jane@example.com',
          password: 'password123',
        },
      };
      const res = mockResponse();

      (userService.createUser as jest.Mock).mockResolvedValue({
        id: 'user123',
        email: 'jane@example.com',
        password: 'password123',
      });
      (jwt.sign as jest.Mock).mockReturnValue('jwtToken');

      await register(req, res);

      expect(userService.createUser).toHaveBeenCalledWith({
        name: 'Jane',
        email: 'jane@example.com',
        password: 'password123',
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123', email: 'jane@example.com' },
        expect.any(String),
        { expiresIn: '7h' }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: 'jwtToken' });
    });

    it('should handle existing user error', async () => {
      const req: any = {
        body: {
          name: 'Jane',
          email: 'jane@example.com',
          password: 'password123',
        },
      };
      const res = mockResponse();

      const error = { response: { status: 400 } };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (userService.createUser as jest.Mock).mockRejectedValue(error);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists or invalid data',
      });
    });
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      const req: any = { body: { email: '', password: '' } };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email and password required',
      });
    });

    it('should return token if credentials are valid', async () => {
      const req: any = {
        body: { email: 'jane@example.com', password: 'password123' },
      };
      const res = mockResponse();

      (userService.getUserByEmail as jest.Mock).mockResolvedValue({
        _id: 'user123',
        email: 'jane@example.com',
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('jwtToken');

      await login(req, res);

      expect(userService.getUserByEmail).toHaveBeenCalledWith('jane@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user123', email: 'jane@example.com' },
        expect.any(String),
        { expiresIn: '7h' }
      );
      expect(res.json).toHaveBeenCalledWith({ token: 'jwtToken' });
    });

    it('should return 401 if password is incorrect', async () => {
      const req: any = {
        body: { email: 'jane@example.com', password: 'wrongpass' },
      };
      const res = mockResponse();

      (userService.getUserByEmail as jest.Mock).mockResolvedValue({
        _id: 'user123',
        email: 'jane@example.com',
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 401 if user not found', async () => {
      const req: any = {
        body: { email: 'nonexistent@example.com', password: 'any' },
      };
      const res = mockResponse();

      const error = { response: { status: 404 } };
      (userService.getUserByEmail as jest.Mock).mockRejectedValue(error);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});
