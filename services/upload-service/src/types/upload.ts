export interface IUploadPayload {
  videoId: string;
  userId: string;
  title: string;
  description: string;
  originalFileName: string;
  fileName: string;
  sizeInBytes: number;
  buffer: Buffer;
  correlationId: string;
  port: number;
}
