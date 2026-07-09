import { env } from '../config/env.js';
import { aiRepository, AiIngestionJob } from '../repositories/ai.repository.js';
import { isHttpError } from '../utils/httpError.js';
import { aiChunkingService } from './aiChunking.service.js';
import { aiExtractionService } from './aiExtraction.service.js';

type ProcessJobResult = {
  jobId: string;
  contentItemId: string;
  status: AiIngestionJob['status'];
  chunksCreated?: number;
  errorMessage?: string;
};

const messageFromError = (error: unknown) => {
  if (isHttpError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown ingestion error';
};

export const aiIngestionService = {
  async processNextBatch(limit = env.AI_INGESTION_BATCH_SIZE): Promise<ProcessJobResult[]> {
    const jobs = await aiRepository.claimQueuedIngestionJobs(limit);
    const results: ProcessJobResult[] = [];

    for (const job of jobs) {
      results.push(await this.processJob(job));
    }

    return results;
  },

  async processJob(job: AiIngestionJob): Promise<ProcessJobResult> {
    try {
      const content = await aiRepository.getIngestibleContent(job.content_item_id);

      if (!content) {
        throw new Error('Content item does not exist');
      }

      const extracted = await aiExtractionService.extract(content);
      const chunks = aiChunkingService.chunkText(extracted.text);

      if (chunks.length === 0) {
        throw new Error('Extracted content produced no chunks');
      }

      await aiRepository.updateIngestionJob({ jobId: job.id, status: 'embedding' });
      await aiRepository.replaceDocumentChunks({
        contentItemId: content.id,
        title: extracted.title,
        sourcePath: extracted.sourcePath,
        chunks,
      });
      await aiRepository.updateIngestionJob({ jobId: job.id, status: 'completed' });

      return {
        jobId: job.id,
        contentItemId: job.content_item_id,
        status: 'completed',
        chunksCreated: chunks.length,
      };
    } catch (error) {
      const errorMessage = messageFromError(error);
      await aiRepository.updateIngestionJob({ jobId: job.id, status: 'failed', errorMessage });

      return {
        jobId: job.id,
        contentItemId: job.content_item_id,
        status: 'failed',
        errorMessage,
      };
    }
  },
};
