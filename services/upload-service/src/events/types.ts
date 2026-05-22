export interface IDomainEvent<T = unknown> {
  eventId: string;
  eventType: 'VIDEO_UPLOADED';
  correlationId: string;
  timestamp: string;
  payload: T;
}

export interface IVideoUploadedPayload {
  videoId: string;
  userId: string;
  title: string;
  originalFileName: string;
  s3Url: string;
  sizeInBytes: number;
}
