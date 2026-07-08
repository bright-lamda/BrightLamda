import { randomUUID } from 'node:crypto';
import { getStorageUploadConfig } from '../config/storage.js';
import { AppRole } from '../domain/types.js';
import { supabaseAdmin } from '../lib/supabase.js';
import { CreateSignedUploadUrlInput } from '../schemas/storage.schema.js';
import { HttpError } from '../utils/httpError.js';

type SignedUploadRequest = CreateSignedUploadUrlInput & {
  actorId: string;
  actorRole: AppRole;
};

const sanitizeFileName = (fileName: string) =>
  fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'upload';

const canUploadKind = (role: AppRole) => role === 'teacher_admin' || role === 'system_admin';

export const storageService = {
  async createSignedUploadUrl(input: SignedUploadRequest) {
    if (!canUploadKind(input.actorRole)) {
      throw new HttpError(403, 'Only teacher admins and system admins can upload learning resources', 'upload_forbidden');
    }

    const config = getStorageUploadConfig(input.kind);

    if (!config.allowedMimeTypes.includes(input.contentType)) {
      throw new HttpError(422, `Unsupported file type for ${input.kind}`, 'unsupported_file_type');
    }

    const safeName = sanitizeFileName(input.fileName);
    const objectPath = `${config.directory}/${input.actorId}/${randomUUID()}-${safeName}`;

    const { data, error } = await supabaseAdmin.storage.from(config.bucket).createSignedUploadUrl(objectPath, {
      upsert: false,
    });

    if (error) {
      throw new HttpError(502, error.message, 'storage_provider_error');
    }

    return {
      bucket: config.bucket,
      path: objectPath,
      signedUrl: data.signedUrl,
      token: data.token,
      maxSizeMb: config.maxSizeMb,
      allowedMimeTypes: config.allowedMimeTypes,
    };
  },
};
