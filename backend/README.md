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

## Cloud Supabase Connection

Bright Lamda uses the hosted Supabase project, not a local database by default. Keep the real values only in `backend/.env`:

- `SUPABASE_URL`: Project URL from Supabase project settings.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only service role key. Never expose this in the mobile app.
- `DATABASE_URL`: Supabase Postgres pooler URL. Prefer the Session Pooler for the long-running Node API.
- `DATABASE_POOL_MIN` / `DATABASE_POOL_MAX`: Backend connection-pool size.
- `DATABASE_CONNECTION_TIMEOUT_MS`: How long the API waits before treating the database as unreachable.

After filling `.env`, run the backend and verify both health endpoints:

```bash
npm run dev
```

```txt
GET http://localhost:4000/api/v1/health
GET http://localhost:4000/api/v1/health/database
```

The `/health/database` endpoint performs a real query through `pg.Pool`, so if it succeeds the backend is connected to Supabase Postgres.

## Main API Groups

- `GET /api/v1/health`
- `GET /api/v1/health/database`
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
