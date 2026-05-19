// shared/event-schema/index.ts
// Standardized Event Interfaces for Distributed Video Processing (DVP) platform.
// Ensures type safety and strict schema contracts between all event publishers and consumers.

export type EventType =
  | 'VIDEO_UPLOADED'
  | 'VIDEO_TRANSCODING_STARTED'
  | 'VIDEO_TRANSCODED'
  | 'THUMBNAIL_GENERATED'
  | 'VIDEO_MODERATION_COMPLETED'
  | 'VIDEO_APPROVED'
  | 'VIDEO_REJECTED'
  | 'VIDEO_PUBLISHED'
  | 'NOTIFICATION_SENT';

// Standard Envelope for all domain events
export interface IDomainEvent<T = unknown> {
  eventId: string;          // Unique UUID for message idempotency
  eventType: EventType;     // Action name (e.g., VIDEO_UPLOADED)
  correlationId: string;    // Request trace ID across services
  timestamp: string;        // ISO-8601 Timestamp
  payload: T;               // Custom event-specific data
}

// ── 1. VIDEO_UPLOADED Event ──
export interface IVideoUploadedPayload {
  videoId: string;
  userId: string;
  title: string;
  originalFileName: string;
  s3Url: string;            // Location of raw uploaded video
  sizeInBytes: number;
}

// ── 2. VIDEO_TRANSCODING_STARTED Event ──
export interface IVideoTranscodingStartedPayload {
  videoId: string;
  resolutions: string[];    // resolutions to be processed e.g., ["360p", "720p", "1080p"]
}

// ── 3. VIDEO_TRANSCODED Event ──
export interface IVideoTranscodedPayload {
  videoId: string;
  userId: string;
  transcodedUrls: {
    resolution: string;     // e.g. "720p"
    s3Url: string;          // Location of the transcoded version
  }[];
  durationInSeconds: number;
}

// ── 4. THUMBNAIL_GENERATED Event ──
export interface IThumbnailGeneratedPayload {
  videoId: string;
  thumbnails: {
    size: string;           // e.g. "small", "medium", "large"
    s3Url: string;
  }[];
}

// ── 5. VIDEO_MODERATION_COMPLETED Event ──
export interface IVideoModerationCompletedPayload {
  videoId: string;
  status: 'approved' | 'rejected';
  reason?: string;
  flaggedKeywords?: string[];
}

// ── 6. VIDEO_PUBLISHED Event ──
export interface IVideoPublishedPayload {
  videoId: string;
  userId: string;
  title: string;
  transcodedUrls: { resolution: string; s3Url: string }[];
  thumbnailUrl: string;
}
