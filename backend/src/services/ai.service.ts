import { query } from '../db/pool.js';
import { env } from '../config/env.js';

export const aiService = {
  askBrightAi: async (input: { studentId: string; question: string }) => {
    const context = await query(
      `
        select content
        from ai_chunks
        order by created_at desc
        limit 6
      `,
    );

    if (env.AI_PROVIDER === 'mock') {
      return {
        answer:
          'Bright AI is connected to the retrieval pipeline. Add notes, generate embeddings, then swap the mock provider for Groq or Gemini.',
        context: context.rows,
      };
    }

    return {
      answer: 'Provider call placeholder. Implement Groq or Gemini client here using the retrieved context.',
      context: context.rows,
    };
  },
};
