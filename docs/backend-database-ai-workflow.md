# Bright Lamda Backend, Database, and Bright AI Workflow

This document defines the production architecture for Bright Lamda across the student app, Teacher Admin, System Admin, Supabase database, and Bright AI.

## Core Architecture

Bright Lamda should use a layered backend:

1. React Native / Expo mobile app
2. Node.js Express REST API
3. Supabase Postgres database
4. Supabase Storage for PDFs, images, and videos
5. Bright AI retrieval service
6. Admin review workflow for teacher-created content

The mobile app must not write privileged data directly to Supabase. Student reads can eventually use Supabase Data APIs where Row Level Security is safe, but all privileged writes should go through the Express backend.

## Backend Responsibilities

The Node.js API owns:

- Authentication/session verification
- Role authorization
- Student profile management
- WhatsApp number capture
- Subject/category selection
- Notes, papers, and answer metadata
- PDF/video/image upload orchestration
- Teacher content submission
- System Admin validation
- Quiz question creation
- Forum posting and moderation
- Notifications
- Bright AI chat and note retrieval

## Roles

### Student

- Reads approved content
- Chooses Ordinary Level Physics, Advanced Level Physics, or Competitive Entrance Physics
- Selects subjects
- Reads Home feed
- Posts in forum
- Uses Bright AI
- Saves/downloads resources
- Takes quizzes

### Teacher Admin

- Can do student actions
- Adds notes, papers, and answers in PDF
- Names each resource, for example `GCE 2025 Physics Paper 1`
- Sets quiz questions
- Sends Physics Blog posts with title, image, and content
- Sends BFA Horizons opportunities with title, image, and content
- Communicates freely in forum
- Teacher file submissions become `pending_review`

### System Admin

- Can do student and teacher actions
- Validates or rejects teacher content
- Adds Teacher Admin accounts
- Adds System Admin accounts
- Can publish directly without validation
- Can moderate platform-wide content

## Supabase Connection Pooling

Use a database pool in the Node.js backend. The scaffold uses `pg.Pool` in `backend/src/db/pool.ts`.

Recommended connection modes:

- Long-running Node server: direct connection if IPv6 is available, or Supabase Supavisor session pooler for IPv4-only networks.
- Serverless deployment: Supavisor transaction pooler on port `6543`.
- Migrations, backups, and `pg_dump`: direct connection.

Supabase documents the main connection choices: direct connection for persistent servers and migrations, session pooler for persistent app traffic on IPv4-only networks, and transaction pooler for serverless/temporary clients. Supabase also notes that connection pooling reuses existing database connections to reduce overhead and improve scalability.

The backend workflow is:

1. Express route receives request.
2. Middleware authenticates user.
3. Role middleware checks permissions.
4. Zod validates body.
5. Service opens a transaction when needed.
6. Repository writes to Supabase Postgres through `pg.Pool`.
7. Database commit makes the change immediately visible to the app.

## Database Workflow

### Content Submission

Teacher Admin:

1. Creates content metadata.
2. Uploads associated file to Supabase Storage.
3. Backend inserts `content_items.status = pending_review`.
4. System Admin sees item in validation queue.
5. System Admin approves or rejects.
6. Approved content becomes visible to students.

System Admin:

1. Creates content metadata.
2. Uploads file.
3. Backend inserts `content_items.status = approved`.
4. Content is immediately visible.

### Physics Blog and BFA Horizons

Teacher or System Admin submits:

- Title
- Image
- Content
- Whether it should also appear in forum

If it appears in the forum:

- Student-facing author should be `Physics Blog` or `BFA Horizons`
- The individual teacher/system admin name should remain hidden in that forum context
- The original author is still stored internally for auditability

### Quiz Workflow

1. Admin creates a quiz.
2. Admin adds questions, options, correct answer, and explanation.
3. Students submit attempts.
4. Backend scores attempt.
5. Results feed progress, leaderboard, and notifications.

### Notifications

Notifications support:

- Announcements
- Quiz reminders
- Forum replies
- Bright AI notifications
- New content uploads

Notifications are written to `notifications` and read by recipient.

## Supabase Storage

Use buckets:

- `notes`
- `papers`
- `answers`
- `blog-images`
- `opportunity-images`
- `paper-3-videos`

Store metadata in Postgres, not only in Storage. Files should have database rows in `content_files`.

## Bright AI Strategy

Do not start by fine-tuning a model. For Bright Lamda, the better production path is retrieval-augmented generation.

Why:

- Your Physics notes change over time.
- You need citations from your own PDFs.
- You need control over approved content.
- Fine-tuning is expensive and does not automatically update when notes change.

### Bright AI Pipeline

1. Admin uploads approved notes, answers, or explanations.
2. Backend extracts text from PDF.
3. Text is chunked into small passages.
4. Each chunk is embedded.
5. Chunks and embeddings are stored in Supabase Postgres with pgvector.
6. Student asks Bright AI a question.
7. Backend embeds the question.
8. Backend retrieves the closest chunks.
9. LLM answers using retrieved context.
10. Response includes citations to the original Bright Lamda resources.

Supabase supports pgvector for embeddings and vector similarity search, and its AI docs describe using Postgres as an AI/vector foundation.

### Free or Beginner AI APIs

For the beginning, use one of these:

1. Groq
   - Good for fast text responses.
   - Has a documented free plan with rate limits.
   - Useful starter model: `llama-3.1-8b-instant`.

2. Google Gemini API
   - Good free-tier candidate for early testing.
   - Official rate limit docs are available and should be checked before production use.

3. Hugging Face Inference Providers
   - Useful for experimenting with open models.
   - Pricing/free usage depends on provider and account credits.

Recommended start:

- Use Supabase pgvector for embeddings storage.
- Use Groq for chat responses while traffic is small.
- Keep the AI provider behind `backend/src/services/ai.service.ts` so you can later switch to Gemini, OpenAI, Anthropic, or a self-hosted model.

### Later Training/Fine-Tuning

Only fine-tune after you have:

- Hundreds or thousands of high-quality question/answer pairs
- Teacher-reviewed explanations
- Clear style requirements
- Evaluation tests
- Budget for repeated training and evaluation

Fine-tuning should teach style and pedagogy. Retrieval should provide current facts and notes.

## Production Security Rules

- Never expose Supabase service role key to the mobile app.
- Use HTTPS everywhere.
- Use RLS for tables exposed to client-side reads.
- Use Express backend for privileged writes.
- Validate every request with Zod.
- Use role checks for admin routes.
- Store audit fields: `author_id`, `reviewed_by`, `reviewed_at`.
- Scan uploads before public use when possible.
- Keep rejected teacher content private.
- Rate-limit auth, AI, forum, and upload endpoints.
- Log admin actions.

## Deployment Workflow

Recommended:

- Mobile: Expo EAS
- API: Render, Railway, Fly.io, or a VPS
- Database: Supabase Postgres
- Storage: Supabase Storage
- CI: GitHub Actions

Deployment steps:

1. Merge to main.
2. CI typechecks mobile and backend.
3. Supabase migrations run against staging.
4. Backend deploys.
5. Smoke tests run.
6. Promote migrations/backend to production.

## Source Notes

- Supabase connection docs: direct, session pooler, and transaction pooler modes.
- Supabase connection docs: pooling improves database performance by reusing existing connections.
- Supabase pgvector docs: embeddings and vector similarity.
- Groq rate limit docs: free plan limits and rate limit headers.
- Gemini API rate limit docs: official model/API rate limits.
- Hugging Face Inference Providers pricing docs: provider-specific billing/free usage.
