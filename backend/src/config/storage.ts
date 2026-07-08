import { StorageUploadKind } from '../schemas/storage.schema.js';

type StorageUploadConfig = {
  bucket: string;
  directory: string;
  allowedMimeTypes: readonly string[];
  maxSizeMb: number;
};

export const storageUploadConfig: Record<StorageUploadKind, StorageUploadConfig> = {
  note_pdf: {
    bucket: 'notes',
    directory: 'notes',
    allowedMimeTypes: ['application/pdf'],
    maxSizeMb: 50,
  },
  paper_pdf: {
    bucket: 'papers',
    directory: 'papers',
    allowedMimeTypes: ['application/pdf'],
    maxSizeMb: 50,
  },
  answer_pdf: {
    bucket: 'answers',
    directory: 'answers',
    allowedMimeTypes: ['application/pdf'],
    maxSizeMb: 50,
  },
  blog_image: {
    bucket: 'blog-images',
    directory: 'physics-blog',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMb: 8,
  },
  opportunity_image: {
    bucket: 'opportunity-images',
    directory: 'bfa-horizons',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMb: 8,
  },
  paper_3_video: {
    bucket: 'paper-3-videos',
    directory: 'paper-3',
    allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
    maxSizeMb: 300,
  },
};

export const getStorageUploadConfig = (kind: StorageUploadKind) => storageUploadConfig[kind];
