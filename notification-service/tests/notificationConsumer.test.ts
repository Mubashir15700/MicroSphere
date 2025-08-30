import { Channel } from 'amqplib';
import { startConsuming } from '../src/consumers/notificationConsumer';
import { logger } from '../src/utils/logger';

// Mock logger
jest.mock('../src/utils/logger', () => ({
  logger: {
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
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should assert queue and consume messages', async () => {
    const queueName = 'test-queue';

    await startConsuming(mockChannel as Channel, queueName);

    expect(mockChannel.assertQueue).toHaveBeenCalledWith(queueName);
    expect(mockChannel.consume).toHaveBeenCalledWith(queueName, expect.any(Function));

    // Simulate a message coming in
    const consumeCallback = (mockChannel.consume as jest.Mock).mock.calls[0][1];
    const mockMsg = {
      content: Buffer.from('Test message'),
    };

    consumeCallback(mockMsg);

    expect(logger.info).toHaveBeenCalledWith('Received message:', 'Test message');
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should ignore null messages', async () => {
    const queueName = 'test-queue';

    await startConsuming(mockChannel as Channel, queueName);

    const consumeCallback = (mockChannel.consume as jest.Mock).mock.calls[0][1];
    consumeCallback(null); // simulate null message

    expect(mockChannel.ack).not.toHaveBeenCalled();
  });

  it('should log errors on assertQueue failure', async () => {
    const queueName = 'test-queue';
    const error = new Error('Queue failed');

    (mockChannel.assertQueue as jest.Mock).mockRejectedValue(error);

    await startConsuming(mockChannel as Channel, queueName);

    expect(logger.error).toHaveBeenCalledWith('Error asserting queue:', error);
  });
});
