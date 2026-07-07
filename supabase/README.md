# Bright Lamda Supabase

This folder contains the database workflow for the production Bright Lamda platform.

## Philosophy

Do not manually maintain production schema from the Supabase dashboard. Schema changes should be written in VS Code as migrations, reviewed, committed, and applied with the Supabase CLI.

## First-Time Setup

```bash
npm install -g supabase
supabase login
supabase link --project-ref <project-ref>
```

## Create a Migration From VS Code

```bash
supabase migration new add_feature_name
```

Edit the generated SQL file under `supabase/migrations`, then apply it:

```bash
supabase db push
```

## Local Development Database

```bash
supabase start
supabase db reset
```

`supabase db reset` applies migrations and `supabase/seed.sql` to the local database.

## Production Database Updates

```bash
supabase db push
```

For production, run this only after the migration has been tested locally or on staging.

## Connection Strategy

- Persistent Node.js backend: use Supabase direct connection when IPv6 is available, or Supavisor session pooler when IPv4-only.
- Serverless backend: use Supavisor transaction pooler on port `6543`; disable prepared statements in that environment.
- Migrations, backups, and `pg_dump`: use the direct connection string.

The Express backend uses `pg.Pool`, so writes made by backend services are committed directly to Supabase Postgres and become visible to the app through normal queries.

## Current Migration Layers

- `0001_bright_lamda_core.sql`: core app tables, enums, base indexes, base RLS, Physics category seed.
- `0002_bright_lamda_database_hardening.sql`: RLS helpers, settings, progress, subscriptions, achievements, storage buckets, audit logs, AI ingestion, stricter policies.

## Storage Buckets

The hardening migration creates these buckets:

- `notes`
- `papers`
- `answers`
- `blog-images`
- `opportunity-images`
- `paper-3-videos`

Metadata belongs in Postgres tables. Files belong in Supabase Storage.
