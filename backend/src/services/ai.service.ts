import { AppRole } from '../domain/types.js';
import { aiRepository } from '../repositories/ai.repository.js';
import { aiProviderService } from './aiProvider.service.js';
import { HttpError } from '../utils/httpError.js';

const titleFromQuestion = (question: string) => {
  const trimmed = question.trim();
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed;
};

const ensureAdmin = (role: AppRole) => {
  if (role !== 'teacher_admin' && role !== 'system_admin') {
    throw new HttpError(403, 'Only admins can queue AI ingestion jobs', 'ai_ingestion_admin_required');
  }
};

export const aiService = {
  async askBrightAi(input: { studentId: string; question: string; conversationId?: string }) {
    const conversation = input.conversationId
      ? await aiRepository.getConversationForStudent({ conversationId: input.conversationId, studentId: input.studentId })
      : await aiRepository.createConversation({ studentId: input.studentId, title: titleFromQuestion(input.question) });

    if (!conversation) {
      throw new HttpError(404, 'AI conversation not found', 'ai_conversation_not_found');
    }

    await aiRepository.createMessage({ conversationId: conversation.id, role: 'user', content: input.question });

    const context = await aiRepository.searchContext(input.question);
    const citations = context.map((chunk) => ({
      chunkId: chunk.id,
      title: chunk.documentTitle,
      sourcePath: chunk.sourcePath,
    }));

    const answer = await aiProviderService.generateAnswer({ question: input.question, context });
    const assistantMessage = await aiRepository.createMessage({
      conversationId: conversation.id,
      role: 'assistant',
      content: answer,
      citations,
    });

    return {
      conversationId: conversation.id,
      answer,
      message: assistantMessage,
      citations,
    };
  },

  listConversations(studentId: string) {
    return aiRepository.listConversations(studentId);
  },

  async listMessages(input: { conversationId: string; studentId: string }) {
    const messages = await aiRepository.listMessages(input);

    if (!messages) {
      throw new HttpError(404, 'AI conversation not found', 'ai_conversation_not_found');
    }

    return messages;
  },

  createIngestionJob(input: { contentItemId: string; actorRole: AppRole }) {
    ensureAdmin(input.actorRole);
    return aiRepository.createIngestionJob({ contentItemId: input.contentItemId });
  },
};
