import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveVideo } from '../services/upload.service';
import { logger } from '../utils/logger';

export const uploadVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Missing video file' });
      return;
    }

    const { title, description, userId, correlationId } = req.body;

    if (!title || !description || !userId) {
      res.status(400).json({ success: false, message: 'Missing required fields: title, description, userId' });
      return;
    }

    const videoId = uuidv4();
    const fileName = `${videoId}-${req.file.originalname}`;
    const eventCorrelationId = correlationId || uuidv4();

    await saveVideo({
      videoId,
      userId,
      title,
      description,
      originalFileName: req.file.originalname,
      fileName,
      sizeInBytes: req.file.size,
      buffer: req.file.buffer,
      correlationId: eventCorrelationId,
      port: Number(process.env.PORT || 3001),
    });

    res.status(201).json({
      success: true,
      videoId,
      title,
      description,
      userId,
      uploadStatus: 'uploaded',
      message: 'Video uploaded successfully',
      correlationId: eventCorrelationId,
    });
  } catch (error) {
    logger.error('Error uploading video', { error });
    next(error);
  }
};
