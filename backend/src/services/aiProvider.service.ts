import { env } from '../config/env.js';
import { AiContextChunk } from '../repositories/ai.repository.js';
import { HttpError } from '../utils/httpError.js';

type GenerateAnswerInput = {
  question: string;
  context: AiContextChunk[];
};

const buildSystemPrompt = (context: AiContextChunk[]) => {
  const contextText = context
    .map((chunk, index) => `[${index + 1}] ${chunk.documentTitle}\n${chunk.content}`)
    .join('\n\n');

  return `You are Bright AI, the academic assistant for Bright Lamda Physics students in Cameroon. Answer clearly, step by step, and cite the provided context when useful. If the context is insufficient, say what is missing and give a careful general explanation.\n\nContext:\n${contextText || 'No retrieved context available.'}`;
};

const generateMockAnswer = (input: GenerateAnswerInput) => {
  const firstContext = input.context[0];

  return firstContext
    ? `Bright AI found relevant material in "${firstContext.documentTitle}". The next production step is to generate embeddings from uploaded notes so this answer can cite exact passages. For now, I can use the retrieved context to guide the explanation.`
    : 'Bright AI is ready, but no learning context has been ingested yet. Upload approved notes, queue ingestion, extract chunks, and connect embeddings so answers can use Bright Lamda materials.';
};

const generateWithGroq = async (input: GenerateAnswerInput) => {
  if (!env.GROQ_API_KEY) {
    throw new HttpError(500, 'GROQ_API_KEY is not configured', 'ai_provider_not_configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL,
      messages: [
        { role: 'system', content: buildSystemPrompt(input.context) },
        { role: 'user', content: input.question },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new HttpError(502, 'Groq provider request failed', 'ai_provider_error');
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? 'Bright AI could not generate an answer.';
};

const generateWithGemini = async (input: GenerateAnswerInput) => {
  if (!env.GEMINI_API_KEY) {
    throw new HttpError(500, 'GEMINI_API_KEY is not configured', 'ai_provider_not_configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${buildSystemPrompt(input.context)}\n\nQuestion: ${input.question}` }],
          },
        ],
        generationConfig: { temperature: 0.2 },
      }),
    },
  );

  if (!response.ok) {
    throw new HttpError(502, 'Gemini provider request failed', 'ai_provider_error');
  }

  const data = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() || 'Bright AI could not generate an answer.';
};

export const aiProviderService = {
  async generateAnswer(input: GenerateAnswerInput) {
    if (env.AI_PROVIDER === 'groq') {
      return generateWithGroq(input);
    }

    if (env.AI_PROVIDER === 'gemini') {
      return generateWithGemini(input);
    }

    return generateMockAnswer(input);
  },
};
