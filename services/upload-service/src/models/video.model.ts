import { Schema, model } from 'mongoose';

export interface IVideoDocument {
  videoId: string;
  userId: string;
  title: string;
  description: string;
  originalFileName: string;
  storageUrl: string;
  sizeInBytes: number;
  status: 'uploaded' | 'processing' | 'completed';
  correlationId: string;
  createdAt: Date;
}

const videoSchema = new Schema<IVideoDocument>({
  videoId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  originalFileName: { type: String, required: true },
  storageUrl: { type: String, required: true },
  sizeInBytes: { type: Number, required: true },
  status: { type: String, required: true, default: 'uploaded' },
  correlationId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const VideoModel = model<IVideoDocument>('Video', videoSchema);
