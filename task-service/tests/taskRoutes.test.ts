import request from 'supertest';
import express from 'express';
import taskRouter from '../src/routes/taskRoutes';
import { Task } from '../src/models/taskModel';
import * as rabbitService from '../src/services/rabbitmqService';
import { verifyToken } from '../src/middlewares/authMiddleware';

jest.mock('../src/models/taskModel');
jest.mock('../src/services/rabbitmqService');
jest.mock('../src/middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/', taskRouter);

describe('Task Routes', () => {
  const mockTokenMiddleware = verifyToken as jest.Mock;

  beforeEach(() => {
    mockTokenMiddleware.mockImplementation((_req, _res, next) => next());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    it('should create task and send to RabbitMQ', async () => {
      const mockTask = {
        _id: 'task123',
        title: 'Test Task',
        description: 'Test Desc',
        userId: 'user123',
        save: jest.fn().mockResolvedValue(true),
      };

      (Task as any).mockImplementation(() => mockTask);
      const sendToQueue = jest.fn();
      (rabbitService.getChannel as jest.Mock).mockReturnValue({ sendToQueue });
      (rabbitService.getQueueName as jest.Mock).mockReturnValue('test-queue');

      const res = await request(app).post('/').send({
        title: 'Test Task',
        description: 'Test Desc',
        userId: 'user123',
      });

      expect(res.status).toBe(201);
      expect(mockTask.save).toHaveBeenCalled();
      expect(sendToQueue).toHaveBeenCalledWith(
        'test-queue',
        Buffer.from(JSON.stringify({ taskId: mockTask._id, userId: 'user123' }))
      );
      expect(res.body).toMatchObject({ title: 'Test Task' });
    });

    it('should return 400 if save fails', async () => {
      (Task as any).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('DB error')),
      }));

      const res = await request(app)
        .post('/')
        .send({ title: 'Test', description: 'Fail', userId: 'user123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('DB error');
    });
  });

  describe('GET /', () => {
    it('should return tasks', async () => {
      const mockTasks = [{ title: 'T1' }, { title: 'T2' }];
      (Task.find as jest.Mock).mockResolvedValue(mockTasks);

      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTasks);
    });

    it('should return 500 if find fails', async () => {
      (Task.find as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('DB error');
    });
  });
});
