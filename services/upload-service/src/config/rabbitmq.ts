import { Channel, ChannelModel, connect } from 'amqplib';
import { env } from './env';
import { logger } from '../utils/logger';

const EXCHANGE_NAME = 'video_events';

let connection: ChannelModel;
let channel: Channel;

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    connection = await connect(env.rabbitmqUrl);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    logger.info('✅ RabbitMQ connected successfully');
  } catch (error) {
    logger.error('❌ RabbitMQ connection failed', { error });
    process.exit(1);
  }
};

export const publishEvent = async (routingKey: string, content: Buffer): Promise<void> => {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }

  const published = channel.publish(EXCHANGE_NAME, routingKey, content, { persistent: true });
  if (!published) {
    logger.warn('RabbitMQ publish backpressure detected');
  }
};

export const closeRabbitMQ = async (): Promise<void> => {
  try {
    await channel?.close();
    await connection?.close();
    logger.info('RabbitMQ connection closed');
  } catch (error) {
    logger.error('Error closing RabbitMQ connection', { error });
  }
};
