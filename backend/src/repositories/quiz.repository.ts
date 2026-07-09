import { PoolClient, QueryResultRow } from 'pg';
import { query } from '../db/pool.js';
import { EducationCategory } from '../domain/types.js';

type DbExecutor = Pick<PoolClient, 'query'>;

export type QuizMode = 'weekly' | 'topic' | 'competition';
export type QuizStatus = 'draft' | 'published' | 'archived';

export type CreateQuizInput = {
  title: string;
  mode: QuizMode;
  educationCategory?: EducationCategory;
  subjectId?: string;
  startsAt?: string;
  endsAt?: string;
  durationMinutes?: number;
  instructions?: string;
  createdBy: string;
};

export type CreateQuizQuestionInput = {
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  createdBy: string;
};

export type AttemptAnswerInput = {
  questionId: string;
  answer: string;
};

const runQuery = <T extends QueryResultRow = QueryResultRow>(executor: DbExecutor | undefined, text: string, params: unknown[] = []) => {
  return executor ? executor.query<T>(text, params) : query<T>(text, params);
};

export const quizRepository = {
  async createQuiz(input: CreateQuizInput, client?: PoolClient) {
    const result = await runQuery(
      client,
      `
        insert into quizzes (
          title, mode, education_category, subject_id, starts_at, ends_at,
          duration_minutes, instructions, created_by, status
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft')
        returning *
      `,
      [
        input.title,
        input.mode,
        input.educationCategory ?? null,
        input.subjectId ?? null,
        input.startsAt ?? null,
        input.endsAt ?? null,
        input.durationMinutes ?? null,
        input.instructions ?? null,
        input.createdBy,
      ],
    );

    return result.rows[0];
  },

  async createQuestion(input: CreateQuizQuestionInput, client?: PoolClient) {
    const result = await runQuery(
      client,
      `
        insert into quiz_questions (quiz_id, question, options, correct_answer, explanation, created_by)
        values ($1, $2, $3, $4, $5, $6)
        returning *
      `,
      [input.quizId, input.question, JSON.stringify(input.options), input.correctAnswer, input.explanation, input.createdBy],
    );

    return result.rows[0];
  },

  async listAdminQuizzes() {
    const result = await query(
      `
        select
          q.*,
          p.full_name as created_by_name,
          count(qq.id)::int as question_count
        from quizzes q
        join profiles p on p.id = q.created_by
        left join quiz_questions qq on qq.quiz_id = q.id
        group by q.id, p.full_name
        order by q.created_at desc
      `,
    );

    return result.rows;
  },

  async listPublishedForStudents(input: { educationCategory?: EducationCategory; subjectId?: string }) {
    const result = await query(
      `
        select
          q.id, q.title, q.mode, q.education_category, q.subject_id, q.starts_at,
          q.ends_at, q.duration_minutes, q.instructions, q.created_at,
          count(qq.id)::int as question_count
        from quizzes q
        left join quiz_questions qq on qq.quiz_id = q.id
        where q.status = 'published'
          and ($1::education_category is null or q.education_category is null or q.education_category = $1)
          and ($2::uuid is null or q.subject_id is null or q.subject_id = $2)
          and (q.starts_at is null or q.starts_at <= now())
          and (q.ends_at is null or q.ends_at >= now())
        group by q.id
        order by q.starts_at desc nulls last, q.created_at desc
      `,
      [input.educationCategory ?? null, input.subjectId ?? null],
    );

    return result.rows;
  },

  async getPublishedQuizForStudent(quizId: string) {
    const result = await query(
      `
        select
          q.id, q.title, q.mode, q.education_category, q.subject_id, q.starts_at,
          q.ends_at, q.duration_minutes, q.instructions, q.created_at,
          coalesce(
            json_agg(
              json_build_object(
                'id', qq.id,
                'question', qq.question,
                'options', qq.options
              ) order by qq.created_at asc
            ) filter (where qq.id is not null),
            '[]'
          ) as questions
        from quizzes q
        left join quiz_questions qq on qq.quiz_id = q.id
        where q.id = $1
          and q.status = 'published'
          and (q.starts_at is null or q.starts_at <= now())
          and (q.ends_at is null or q.ends_at >= now())
        group by q.id
      `,
      [quizId],
    );

    return result.rows[0] ?? null;
  },

  async getQuestionsForGrading(quizId: string) {
    const result = await query<
      QueryResultRow & { id: string; correct_answer: string; explanation: string }
    >(
      `
        select id, correct_answer, explanation
        from quiz_questions
        where quiz_id = $1
        order by created_at asc
      `,
      [quizId],
    );

    return result.rows;
  },

  async setQuizStatus(quizId: string, status: QuizStatus, client?: PoolClient) {
    const result = await runQuery(
      client,
      `
        update quizzes
        set status = $1
        where id = $2
        returning *
      `,
      [status, quizId],
    );

    return result.rows[0] ?? null;
  },

  async createAttempt(input: { quizId: string; studentId: string; score: number; answers: unknown[] }, client?: PoolClient) {
    const result = await runQuery(
      client,
      `
        insert into quiz_attempts (quiz_id, student_id, score, answers, completed_at)
        values ($1, $2, $3, $4, now())
        returning *
      `,
      [input.quizId, input.studentId, input.score, JSON.stringify(input.answers)],
    );

    return result.rows[0];
  },
};
