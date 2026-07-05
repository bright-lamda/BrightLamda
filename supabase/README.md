# Bright Lamda Supabase

This folder contains the database schema for the production Bright Lamda platform.

## Apply Migrations

```bash
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

## Connection Strategy

- Persistent Node.js backend: use Supabase direct connection when IPv6 is available, or Supavisor session pooler when IPv4-only.
- Serverless backend: use Supavisor transaction pooler on port `6543`; disable prepared statements in the database client.
- Migrations and backups: use the direct connection string.

The application backend uses `pg.Pool` so writes made through Express are committed directly to Supabase Postgres.
