do $$ begin
  create type quiz_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

alter table quizzes
  add column if not exists status quiz_status not null default 'draft',
  add column if not exists duration_minutes integer,
  add column if not exists instructions text;

create index if not exists idx_quizzes_status_schedule on quizzes(status, starts_at, ends_at);

drop policy if exists "students read quizzes" on quizzes;
create policy "students read published quizzes"
on quizzes for select
using (
  status = 'published'
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

drop policy if exists "students read quiz questions" on quiz_questions;
