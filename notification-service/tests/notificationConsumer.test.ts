import { Channel } from 'amqplib';
import startConsuming from '../src/consumers/notificationConsumer';
import logger from '../src/utils/logger';

jest.mock('../src/services/notificationService', () => ({
  createNotification: jest.fn().mockResolvedValue(true),
}));

// Mock logger
jest.mock('../src/utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Notification Consumer', () => {
  let mockChannel: Partial<Channel>;

  beforeEach(() => {
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue(undefined),
      consume: jest.fn(),
      ack: jest.fn(),
      nack: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should assert queue and consume messages', async () => {
    const queueName = 'test-queue';

    await startConsuming(mockChannel as Channel, queueName);

    expect(mockChannel.assertQueue).toHaveBeenCalledWith(queueName, { durable: true });
    expect(mockChannel.consume).toHaveBeenCalledWith(queueName, expect.any(Function));

    // Simulate a message coming in
    const consumeCallback = (mockChannel.consume as jest.Mock).mock.calls[0][1];
    const mockMsg = {
      content: Buffer.from(JSON.stringify({ userId: '123', message: 'Test message' })),
    };

    await consumeCallback(mockMsg);

    expect(logger.info).toHaveBeenCalledWith(`Received message: ${mockMsg.content.toString()}`);

    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should ignore null messages', async () => {
    const queueName = 'test-queue';

    await startConsuming(mockChannel as Channel, queueName);

    const consumeCallback = (mockChannel.consume as jest.Mock).mock.calls[0][1];
    consumeCallback(null); // simulate null message

    expect(mockChannel.ack).not.toHaveBeenCalled();
  });

  // it('should log errors on assertQueue failure', async () => {
  //   const queueName = 'test-queue';
  //   const error = new Error('Queue failed');

  //   (mockChannel.assertQueue as jest.Mock).mockRejectedValue(error);

  //   await startConsuming(mockChannel as Channel, queueName);

  //   expect(logger.error).toHaveBeenCalledWith('Error asserting queue:', error);
  // });
});
