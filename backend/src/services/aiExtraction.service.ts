import { IngestibleContent } from '../repositories/ai.repository.js';
import { HttpError } from '../utils/httpError.js';

export type ExtractedAiDocument = {
  title: string;
  sourcePath?: string | null;
  text: string;
};

const textContentTypes = new Set(['physics_blog', 'bfa_horizons']);

export const aiExtractionService = {
  async extract(content: IngestibleContent): Promise<ExtractedAiDocument> {
    if (content.status !== 'approved') {
      throw new HttpError(422, 'Only approved content can be ingested by Bright AI', 'ai_content_not_approved');
    }

    if (textContentTypes.has(content.type) && content.body?.trim()) {
      return {
        title: content.title,
        sourcePath: content.files[0]?.storage_path ?? null,
        text: content.body,
      };
    }

    const primaryFile = content.files[0];

    if (primaryFile?.mime_type === 'application/pdf') {
      throw new HttpError(501, 'PDF text extraction worker is not implemented yet', 'pdf_extractor_not_implemented');
    }

    if (primaryFile?.mime_type.startsWith('video/')) {
      throw new HttpError(501, 'Video transcript extraction worker is not implemented yet', 'video_extractor_not_implemented');
    }

    throw new HttpError(422, 'Content has no ingestible text or supported file', 'ai_content_not_ingestible');
  },
};
