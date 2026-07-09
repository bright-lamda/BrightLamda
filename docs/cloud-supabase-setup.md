# Cloud Supabase Setup

Bright Lamda is designed to use your hosted Supabase project. Do not paste real credentials into chat, GitHub, screenshots, or committed files. Put them only in local `.env` files or deployment secrets.

## 1. Values Needed

### Mobile `.env`

Create `.env` at the project root from `.env.example`:

```bash
cp .env.example .env
```

Fill:

- `EXPO_PUBLIC_API_URL`: local backend URL during development, usually `http://localhost:4000/api/v1`.
- `EXPO_PUBLIC_SUPABASE_URL`: your Supabase project URL.
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the public client key. If your project still uses legacy keys, use the `anon` key here.

These Expo values are public by design. They can be included in the mobile bundle.

### Backend `backend/.env`

Create `backend/.env` from `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

Fill:

- `SUPABASE_URL`: your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only secret key. Prefer a new Supabase secret key if available, or use the legacy `service_role` key.
- `DATABASE_URL`: Supabase Postgres connection string. For this persistent Node backend, use the Session Pooler URL when your network is IPv4-only.
- `GROQ_API_KEY` or `GEMINI_API_KEY`: optional for Bright AI. Keep `AI_PROVIDER=mock` until you are ready.

Never put `SUPABASE_SERVICE_ROLE_KEY`, database passwords, Groq keys, or Gemini keys in mobile env files.

## 2. Where To Find Them In Supabase

In the Supabase Dashboard:

1. Open your project.
2. For API keys, open the project Connect dialog or go to `Settings > API Keys`.
3. Copy the Project URL for both mobile and backend.
4. Copy the Publishable key for mobile. If using legacy keys, copy the `anon` key instead.
5. Copy the Secret key for backend. If using legacy keys, copy the `service_role` key instead.
6. For the database URL, go to the database connection settings and copy the pooler connection string. Use Session Pooler for the long-running Express backend.
7. Replace `[YOUR-PASSWORD]` in the database URL with your Supabase database password.

## 3. Link Migrations To Your Cloud Project

Install and login to the Supabase CLI:

```bash
npm install -g supabase
supabase login
```

Link this repo to your hosted project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Your project ref is the subdomain part of your Supabase URL:

```txt
https://YOUR_PROJECT_REF.supabase.co
```

Apply migrations from VS Code to your cloud database:

```bash
supabase db push
```

This applies the committed SQL migration files in `supabase/migrations`. Do not manually recreate these tables in the Supabase dashboard.

## 4. Verify The Backend Connection

After filling `backend/.env`:

```bash
cd backend
npm run dev
```

Open:

```txt
http://localhost:4000/api/v1/health
http://localhost:4000/api/v1/health/database
```

If `/health/database` returns `ok: true`, the backend is connected to your cloud Supabase Postgres through the pool.

## 5. Safe Secret Rules

- Public/mobile: Project URL and publishable/anon key.
- Backend only: secret/service-role key, database URL, database password, AI provider keys.
- GitHub: use repository secrets for deployments, never committed `.env` files.
- Chat: do not send real secrets. If I need a value, I will tell you the variable name and where to paste it locally.
