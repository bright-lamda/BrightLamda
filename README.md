# Bright Lamda

Bright Lamda is a premium Physics learning platform for Cameroon Ordinary Level, Advanced Level, and Competitive Entrance Examination students.

This repository contains:

- Expo React Native student mobile app
- Node.js/Express backend
- Supabase Postgres migrations
- Supabase Storage workflow
- Bright AI conversation and ingestion foundation

## Quick Start

Install mobile dependencies from the repo root:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create local environment files:

```bash
cp .env.example .env
cd backend
cp .env.example .env
```

Read the cloud setup guide before filling credentials:

```txt
docs/cloud-supabase-setup.md
```

## Mobile Auth

The Expo app uses Supabase Auth for sign up/sign in. After Supabase returns an access token, the app calls the backend `/api/v1/auth/profile` or `/api/v1/auth/me` endpoint so Bright Lamda can resolve the student profile, education category, and role from Postgres.
## First System Admin

After the cloud database is migrated, create the first system admin from local backend env values:

```bash
npm run bootstrap:system-admin
```

Required local-only values in `backend/.env`:

- `BOOTSTRAP_SYSTEM_ADMIN_EMAIL`
- `BOOTSTRAP_SYSTEM_ADMIN_PASSWORD`
- `BOOTSTRAP_SYSTEM_ADMIN_FULL_NAME`
- `BOOTSTRAP_SYSTEM_ADMIN_WHATSAPP`

After the first system admin exists, use `POST /api/v1/admin/accounts` to invite teacher admins or other system admins.
## Common Commands

```bash
npm run start
npm run typecheck
npm run backend:dev
npm run backend:typecheck
npm run backend:worker:ai-ingestion
npm run db:migrate
npm run db:verify
npm run supabase:db:push
```

## Safety

Never commit real `.env` files, database passwords, Supabase secret/service-role keys, or AI provider keys.



