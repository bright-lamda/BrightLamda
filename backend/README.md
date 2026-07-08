# Bright Lamda Backend

Production-oriented Node.js backend scaffold for Bright Lamda.

## Stack

- Node.js
- Express
- TypeScript
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- `pg.Pool` for database pooling
- Zod validation
- Role-based backend authorization

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

## Authentication Workflow

Clients authenticate with Supabase Auth, then send the Supabase access token to this backend:

```txt
Authorization: Bearer <supabase-access-token>
```

The backend verifies the token with Supabase, then resolves the Bright Lamda `profiles` row to determine the user role and profile id used by content, forum, AI, and admin tables.

Profile endpoints:

- `GET /api/v1/auth/me`: Returns the resolved Bright Lamda user profile for a valid Supabase token.
- `POST /api/v1/auth/profile`: Creates or updates the student profile after Supabase signup.

Example profile body:

```json
{
  "fullName": "Student Name",
  "whatsappNumber": "+237600000000",
  "educationCategory": "ordinary_physics"
}
```

## Storage Upload Workflow

The API creates signed Supabase Storage upload URLs for trusted admin users. The client uploads directly to Supabase with the returned URL, while the backend controls bucket selection, path naming, MIME type validation, and role access.

```txt
POST /api/v1/storage/signed-upload-url
```

Supported upload kinds:

- `note_pdf` -> `notes` bucket
- `paper_pdf` -> `papers` bucket
- `answer_pdf` -> `answers` bucket
- `blog_image` -> `blog-images` bucket
- `opportunity_image` -> `opportunity-images` bucket
- `paper_3_video` -> `paper-3-videos` bucket

Example request body:

```json
{
  "kind": "note_pdf",
  "fileName": "gce-2025-physics-note.pdf",
  "contentType": "application/pdf"
}
```

## Content Publishing Workflow

Teacher admins and system admins create content through the backend. Teacher-admin submissions enter `pending_review`; system-admin submissions are approved immediately.

PDF resources can attach a file that was uploaded through the signed upload flow:

```json
{
  "type": "paper",
  "name": "GCE 2025 Physics Paper 1",
  "educationCategory": "ordinary_physics",
  "subjectId": "00000000-0000-0000-0000-000000000000",
  "paperKind": "paper_1",
  "file": {
    "storageBucket": "papers",
    "storagePath": "papers/admin-id/file.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 204800
  }
}
```

System admins review teacher content through:

- `GET /api/v1/admin/pending-content`
- `POST /api/v1/admin/content/:id/approve`
- `POST /api/v1/admin/content/:id/reject`

Rejections require a reason and all create/review actions are written to `admin_audit_logs`.
## Main API Groups

- `GET /api/v1/health`
- `GET /api/v1/health/database`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/profile`
- `POST /api/v1/storage/signed-upload-url`
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

- Admin invitation acceptance flow
- Linking uploaded files to approved content records
- PDF text extraction
- Embedding generation
- Groq/Gemini provider calls
- Full audit logging
- Rate limiting

