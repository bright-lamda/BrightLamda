# Bright Lamda Backend

Production-oriented Node.js backend scaffold for Bright Lamda.

## Stack

- Node.js
- Express
- TypeScript
- Supabase Postgres
- Supabase Storage
- `pg.Pool` for database pooling
- Zod validation
- JWT auth middleware

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Main API Groups

- `GET /api/v1/health`
- `POST /api/v1/content/pdf-resources`
- `POST /api/v1/content/publications`
- `POST /api/v1/content/quiz-questions`
- `GET /api/v1/admin/pending-content`
- `POST /api/v1/admin/content/:id/approve`
- `POST /api/v1/admin/content/:id/reject`
- `POST /api/v1/admin/accounts`
- `POST /api/v1/ai/ask`
- `GET /api/v1/forum/posts`
- `POST /api/v1/forum/posts`

## Important

This backend is intentionally scaffolded with real production boundaries, but provider-specific details still need implementation:

- Supabase Auth token verification
- File upload streaming to Supabase Storage
- PDF text extraction
- Embedding generation
- Groq/Gemini provider calls
- Full audit logging
- Rate limiting
