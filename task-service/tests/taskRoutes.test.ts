import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { createTask } from '../src/controllers/taskController';
import Task from '../src/models/taskModel';
import * as rabbitmqService from '../src/services/rabbitmqService';
import * as userService from '../src/services/userService';

jest.mock('../src/models/taskModel');
jest.mock('../src/services/userService');
jest.mock('../src/services/rabbitmqService');

describe('createTask', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();

    req = {
      body: {
        title: 'Test Task',
        description: 'Test Description',
        assigneeId: new mongoose.Types.ObjectId().toString(),
      },
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('should create a task and send a message if assignee exists', async () => {
    // Mocking user service to return a valid user
    (userService.getUserByID as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

    // Mocking Task.save() to return a valid task object
    const mockTask = { _id: '123', title: 'Test Task', description: 'Test Description' };
    (Task.prototype.save as jest.Mock).mockResolvedValue(mockTask);

    // Mocking RabbitMQ channel
    const sendToQueueMock = jest.fn();
    (rabbitmqService.getChannel as jest.Mock).mockReturnValue({ sendToQueue: sendToQueueMock });
    (rabbitmqService.getQueueName as jest.Mock).mockReturnValue('testQueue');

    await createTask(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);

    // expect(jsonMock).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     title: 'Test Task',
    //     description: 'Test Description',
    //     _id: '123',
    //   })
    // );

    expect(sendToQueueMock).toHaveBeenCalled();
  });

  it('should return 404 if user is not found', async () => {
    (userService.getUserByID as jest.Mock).mockResolvedValue({});

    await createTask(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle duplicate title error', async () => {
    (userService.getUserByID as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
    const error = new Error('Duplicate') as any;
    error.code = 11000;
    (Task.prototype.save as jest.Mock).mockRejectedValue(error);

    await createTask(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Task with this title already exists.',
    });
  });
});
