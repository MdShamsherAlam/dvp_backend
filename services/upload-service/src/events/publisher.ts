import { publishEvent } from '../config/rabbitmq';
import { IDomainEvent, IVideoUploadedPayload } from './types';
import { logger } from '../utils/logger';

export const publishVideoUploadedEvent = async (payload: IVideoUploadedPayload, correlationId: string): Promise<void> => {
  const event: IDomainEvent<IVideoUploadedPayload> = {
    eventId: payload.videoId,
    eventType: 'VIDEO_UPLOADED',
    correlationId,
    timestamp: new Date().toISOString(),
    payload,
  };

  await publishEvent('VIDEO_UPLOADED', Buffer.from(JSON.stringify(event)));
  logger.info('Published VIDEO_UPLOADED event', { eventId: event.eventId, correlationId });
};
