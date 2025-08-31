import request from 'supertest';
import express from 'express';
import taskRouter from '../src/routes/taskRoutes';
import { Task } from '../src/models/taskModel';
import * as rabbitService from '../src/services/rabbitmqService';
import { verifyToken } from '../src/middlewares/authMiddleware';

jest.mock('../src/models/taskModel', () => {
  return {
    Task: Object.assign(
      jest.fn().mockImplementation(() => ({
        save: jest.fn(),
      })),
      {
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
      }
    ),
  };
});
jest.mock('../src/services/rabbitmqService', () => ({
  getChannel: jest.fn().mockReturnValue({ sendToQueue: jest.fn() }),
  getQueueName: jest.fn().mockReturnValue('test-queue'),
}));
jest.mock('../src/middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/', taskRouter);

describe('Task Routes', () => {
  const mockTokenMiddleware = verifyToken as jest.Mock;

  beforeEach(() => {
    mockTokenMiddleware.mockImplementation((req, _res, next) => {
      (req as any).user = { userId: 'user123', role: 'admin' };
      next();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    it('should create task and send to RabbitMQ', async () => {
      const mockTask = {
        _id: '64e4b9f1c2a1d2b4f5e6a787',
        title: 'Test Task',
        description: 'Test Desc',
        assigneeId: '64e4b9f1c2a1d2b4f5e6a784',
        save: jest.fn().mockResolvedValue(true),
      };

      (Task as any).mockImplementation(() => mockTask);
      const sendToQueue = jest.fn();
      (rabbitService.getChannel as jest.Mock).mockResolvedValue({
        sendToQueue: jest.fn(),
      });
      (rabbitService.getQueueName as jest.Mock).mockReturnValue('test-queue');

      const res = await request(app).post('/').send({
        title: 'Test Task',
        description: 'Test Desc',
        assigneeId: '64e4b9f1c2a1d2b4f5e6a784',
      });

      expect(res.status).toBe(201);
      expect(mockTask.save).toHaveBeenCalled();
      expect(sendToQueue).toHaveBeenCalledWith(
        'test-queue',
        Buffer.from(JSON.stringify({ taskId: mockTask._id, userId: '64e4b9f1c2a1d2b4f5e6a784' }))
      );
      expect(res.body).toMatchObject({ title: 'Test Task' });
    });

    it('should return 500 if save fails', async () => {
      (Task as any).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('DB error')),
      }));

      const res = await request(app)
        .post('/')
        .send({ title: 'Test', description: 'Fail', userId: '64e4b9f1c2a1d2b4f5e6a787' });

      expect(res.status).toBe(500);
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
