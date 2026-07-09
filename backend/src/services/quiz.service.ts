import { withTransaction } from '../db/transaction.js';
import { AppRole, EducationCategory } from '../domain/types.js';
import { contentRepository } from '../repositories/content.repository.js';
import { AttemptAnswerInput, quizRepository, QuizMode, QuizStatus } from '../repositories/quiz.repository.js';
import { HttpError } from '../utils/httpError.js';

const ensureAdmin = (role: AppRole) => {
  if (role !== 'teacher_admin' && role !== 'system_admin') {
    throw new HttpError(403, 'Only admins can manage quizzes', 'quiz_admin_required');
  }
};

export const quizService = {
  createQuiz(input: {
    title: string;
    mode: QuizMode;
    educationCategory?: EducationCategory;
    subjectId?: string;
    startsAt?: string;
    endsAt?: string;
    durationMinutes?: number;
    instructions?: string;
    createdBy: string;
    actorRole: AppRole;
  }) {
    ensureAdmin(input.actorRole);

    return withTransaction(async (client) => {
      const quiz = await quizRepository.createQuiz(input, client);

      await contentRepository.createAuditLog(
        {
          actorId: input.createdBy,
          action: 'quiz.created',
          entityType: 'quiz',
          entityId: quiz.id,
          metadata: { mode: input.mode, status: 'draft' },
        },
        client,
      );

      return quiz;
    });
  },

  addQuestion(input: {
    quizId: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    createdBy: string;
    actorRole: AppRole;
  }) {
    ensureAdmin(input.actorRole);

    if (!input.options.includes(input.correctAnswer)) {
      throw new HttpError(422, 'Correct answer must match one of the provided options', 'invalid_correct_answer');
    }

    return withTransaction(async (client) => {
      const question = await quizRepository.createQuestion(input, client);

      await contentRepository.createAuditLog(
        {
          actorId: input.createdBy,
          action: 'quiz.question_created',
          entityType: 'quiz',
          entityId: input.quizId,
          metadata: { questionId: question.id },
        },
        client,
      );

      return question;
    });
  },

  listAdminQuizzes() {
    return quizRepository.listAdminQuizzes();
  },

  listPublishedForStudents(input: { educationCategory?: EducationCategory; subjectId?: string }) {
    return quizRepository.listPublishedForStudents(input);
  },

  async getPublishedQuizForStudent(quizId: string) {
    const quiz = await quizRepository.getPublishedQuizForStudent(quizId);

    if (!quiz) {
      throw new HttpError(404, 'Quiz not found or not currently available', 'quiz_not_available');
    }

    return quiz;
  },

  setStatus(input: { quizId: string; status: QuizStatus; actorId: string; actorRole: AppRole }) {
    ensureAdmin(input.actorRole);

    return withTransaction(async (client) => {
      if (input.status === 'published') {
        const questions = await quizRepository.getQuestionsForGrading(input.quizId);
        if (questions.length === 0) {
          throw new HttpError(422, 'A quiz needs at least one question before publishing', 'quiz_has_no_questions');
        }
      }

      const quiz = await quizRepository.setQuizStatus(input.quizId, input.status, client);

      if (!quiz) {
        throw new HttpError(404, 'Quiz not found', 'quiz_not_found');
      }

      await contentRepository.createAuditLog(
        {
          actorId: input.actorId,
          action: `quiz.${input.status}`,
          entityType: 'quiz',
          entityId: input.quizId,
          metadata: { status: input.status },
        },
        client,
      );

      return quiz;
    });
  },

  submitAttempt(input: { quizId: string; studentId: string; answers: AttemptAnswerInput[] }) {
    return withTransaction(async (client) => {
      const quiz = await quizRepository.getPublishedQuizForStudent(input.quizId);
      if (!quiz) {
        throw new HttpError(404, 'Quiz not found or not currently available', 'quiz_not_available');
      }

      const questions = await quizRepository.getQuestionsForGrading(input.quizId);
      if (questions.length === 0) {
        throw new HttpError(422, 'Quiz has no questions', 'quiz_has_no_questions');
      }

      const answersByQuestion = new Map(input.answers.map((answer) => [answer.questionId, answer.answer]));
      const gradedAnswers = questions.map((question) => {
        const submittedAnswer = answersByQuestion.get(question.id) ?? null;
        const isCorrect = submittedAnswer === question.correct_answer;

        return {
          questionId: question.id,
          answer: submittedAnswer,
          correctAnswer: question.correct_answer,
          explanation: question.explanation,
          isCorrect,
        };
      });

      const correctCount = gradedAnswers.filter((answer) => answer.isCorrect).length;
      const score = Number(((correctCount / questions.length) * 100).toFixed(2));

      return quizRepository.createAttempt(
        {
          quizId: input.quizId,
          studentId: input.studentId,
          score,
          answers: gradedAnswers,
        },
        client,
      );
    });
  },
};
