import fs from 'fs/promises';
import path from 'path';
import { VideoModel } from '../models/video.model';
import { publishVideoUploadedEvent } from '../events/publisher';
import { IUploadPayload } from '../types/upload';
import { logger } from '../utils/logger';
import { env } from '../config/env';

const uploadsDir = path.resolve(__dirname, '../../uploads');

const ensureUploadsDir = async (): Promise<void> => {
  await fs.mkdir(uploadsDir, { recursive: true });
};

export const saveVideo = async (params: IUploadPayload): Promise<void> => {
  await ensureUploadsDir();

  const filePath = path.join(uploadsDir, params.fileName);
  await fs.writeFile(filePath, params.buffer);

  const storageUrl = `${env.uploadServiceBaseUrl}/uploads/${params.fileName}`;

  const video = await VideoModel.create({
    videoId: params.videoId,
    userId: params.userId,
    title: params.title,
    description: params.description,
    originalFileName: params.originalFileName,
    storageUrl,
    sizeInBytes: params.sizeInBytes,
    status: 'uploaded',
    correlationId: params.correlationId,
  });

  logger.info('Saved video metadata to MongoDB', { videoId: video.videoId });

  await publishVideoUploadedEvent(
    {
      videoId: params.videoId,
      userId: params.userId,
      title: params.title,
      originalFileName: params.originalFileName,
      s3Url: storageUrl,
      sizeInBytes: params.sizeInBytes,
    },
    params.correlationId
  );
};
