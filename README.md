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

## Common Commands

```bash
npm run start
npm run typecheck
npm run backend:dev
npm run backend:typecheck
npm run backend:worker:ai-ingestion
npm run supabase:db:push
```

## Safety

Never commit real `.env` files, database passwords, Supabase secret/service-role keys, or AI provider keys.
