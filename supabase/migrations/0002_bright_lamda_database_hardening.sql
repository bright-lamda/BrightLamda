create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.current_app_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.is_teacher_or_system_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('teacher_admin', 'system_admin'), false);
$$;

create or replace function public.is_system_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'system_admin', false);
$$;

alter table profiles
  add column if not exists language text not null default 'en',
  add column if not exists notification_preferences jsonb not null default '{"announcements":true,"quizReminders":true,"forumReplies":true,"ai":true,"contentUploads":true}',
  add column if not exists download_preferences jsonb not null default '{"wifiOnly":true,"autoDownload":false}',
  add column if not exists privacy_settings jsonb not null default '{"showForumName":true}',
  add column if not exists subscription_status text not null default 'free',
  add column if not exists whatsapp_admin_contact_saved boolean not null default false;

alter table content_files
  add constraint content_files_storage_path_key unique (storage_path);

alter table content_items
  add constraint content_items_forum_display_check check (
    visible_in_forum = false
    or forum_display_name in ('Physics Blog', 'BFA Horizons')
    or type not in ('physics_blog', 'bfa_horizons')
  );

create table if not exists learning_progress (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  content_item_id uuid references content_items(id) on delete cascade,
  progress_percent numeric(5, 2) not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  last_position jsonb not null default '{}',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, content_item_id)
);

create table if not exists achievements (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  title text not null,
  description text not null,
  icon text not null default 'medal-outline',
  created_at timestamptz not null default now()
);

create table if not exists student_achievements (
  student_id uuid not null references profiles(id) on delete cascade,
  achievement_id uuid not null references achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (student_id, achievement_id)
);

create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  plan_code text not null,
  status text not null check (status in ('trialing', 'active', 'past_due', 'cancelled', 'expired')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  provider text,
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists help_requests (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid references profiles(id) on delete set null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ai_ingestion_jobs (
  id uuid primary key default uuid_generate_v4(),
  content_item_id uuid references content_items(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'extracting', 'embedding', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on profiles
for each row execute function public.set_updated_at();

create trigger content_items_set_updated_at
before update on content_items
for each row execute function public.set_updated_at();

create trigger forum_posts_set_updated_at
before update on forum_posts
for each row execute function public.set_updated_at();

create trigger learning_progress_set_updated_at
before update on learning_progress
for each row execute function public.set_updated_at();

create trigger subscriptions_set_updated_at
before update on subscriptions
for each row execute function public.set_updated_at();

create trigger help_requests_set_updated_at
before update on help_requests
for each row execute function public.set_updated_at();

create trigger ai_ingestion_jobs_set_updated_at
before update on ai_ingestion_jobs
for each row execute function public.set_updated_at();

create index if not exists idx_profiles_auth_user_id on profiles(auth_user_id);
create index if not exists idx_content_author_status on content_items(author_id, status);
create index if not exists idx_content_subject_type on content_items(subject_id, type);
create index if not exists idx_content_files_item on content_files(content_item_id);
create index if not exists idx_quiz_questions_quiz on quiz_questions(quiz_id);
create index if not exists idx_quiz_attempts_student on quiz_attempts(student_id, created_at desc);
create index if not exists idx_learning_progress_student on learning_progress(student_id, updated_at desc);
create index if not exists idx_downloads_student on downloads(student_id, created_at desc);
create index if not exists idx_admin_audit_actor on admin_audit_logs(actor_id, created_at desc);
create index if not exists idx_ai_documents_content on ai_documents(content_item_id);

alter table admin_invitations enable row level security;
alter table student_subjects enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_attempts enable row level security;
alter table ai_documents enable row level security;
alter table ai_chunks enable row level security;
alter table learning_progress enable row level security;
alter table achievements enable row level security;
alter table student_achievements enable row level security;
alter table subscriptions enable row level security;
alter table admin_audit_logs enable row level security;
alter table help_requests enable row level security;
alter table ai_ingestion_jobs enable row level security;

drop policy if exists "students read approved content" on content_items;
drop policy if exists "users read forum posts" on forum_posts;
drop policy if exists "users read own notifications" on notifications;

create policy "authenticated users read approved content"
on content_items for select
using (auth.role() = 'authenticated' and status = 'approved');

create policy "authenticated users read forum posts"
on forum_posts for select
using (auth.role() = 'authenticated');

create policy "users read own profile"
on profiles for select
using (id = public.current_profile_id() or public.is_teacher_or_system_admin());

create policy "users update own basic profile"
on profiles for update
using (id = public.current_profile_id())
with check (id = public.current_profile_id());

create policy "system admins manage profiles"
on profiles for all
using (public.is_system_admin())
with check (public.is_system_admin());

create policy "students manage own subject choices"
on student_subjects for all
using (student_id = public.current_profile_id())
with check (student_id = public.current_profile_id());

create policy "admins manage admin invitations"
on admin_invitations for all
using (public.is_system_admin())
with check (public.is_system_admin());

create policy "admins submit content"
on content_items for insert
with check (public.is_teacher_or_system_admin() and author_id = public.current_profile_id());

create policy "authors read own content"
on content_items for select
using (author_id = public.current_profile_id() or public.is_teacher_or_system_admin());

create policy "system admins review content"
on content_items for update
using (public.is_system_admin())
with check (public.is_system_admin());

create policy "admins manage content files"
on content_files for all
using (public.is_teacher_or_system_admin())
with check (public.is_teacher_or_system_admin());

create policy "students read approved content files"
on content_files for select
using (
  exists (
    select 1 from content_items ci
    where ci.id = content_files.content_item_id
      and ci.status = 'approved'
  )
);

create policy "admins manage quizzes"
on quizzes for all
using (public.is_teacher_or_system_admin())
with check (public.is_teacher_or_system_admin());

create policy "students read quizzes"
on quizzes for select
using (true);

create policy "admins manage quiz questions"
on quiz_questions for all
using (public.is_teacher_or_system_admin())
with check (public.is_teacher_or_system_admin());

create policy "students read quiz questions"
on quiz_questions for select
using (true);

create policy "students manage own quiz attempts"
on quiz_attempts for all
using (student_id = public.current_profile_id())
with check (student_id = public.current_profile_id());

create policy "admins read quiz attempts"
on quiz_attempts for select
using (public.is_teacher_or_system_admin());

create policy "users create forum posts"
on forum_posts for insert
with check (author_id = public.current_profile_id() or public.is_teacher_or_system_admin());

create policy "users update own forum posts"
on forum_posts for update
using (author_id = public.current_profile_id())
with check (author_id = public.current_profile_id());

create policy "users read own notifications"
on notifications for select
using (recipient_id = public.current_profile_id());

create policy "admins create notifications"
on notifications for insert
with check (public.is_teacher_or_system_admin());

create policy "users mark own notifications"
on notifications for update
using (recipient_id = public.current_profile_id())
with check (recipient_id = public.current_profile_id());

create policy "students manage own saved resources"
on saved_resources for all
using (student_id = public.current_profile_id())
with check (student_id = public.current_profile_id());

create policy "students manage own downloads"
on downloads for all
using (student_id = public.current_profile_id())
with check (student_id = public.current_profile_id());

create policy "students manage own progress"
on learning_progress for all
using (student_id = public.current_profile_id())
with check (student_id = public.current_profile_id());

create policy "public read achievements"
on achievements for select
using (true);

create policy "students read own achievements"
on student_achievements for select
using (student_id = public.current_profile_id());

create policy "admins award achievements"
on student_achievements for insert
with check (public.is_teacher_or_system_admin());

create policy "students read own subscriptions"
on subscriptions for select
using (student_id = public.current_profile_id() or public.is_system_admin());

create policy "system admins manage subscriptions"
on subscriptions for all
using (public.is_system_admin())
with check (public.is_system_admin());

create policy "system admins read audit logs"
on admin_audit_logs for select
using (public.is_system_admin());

create policy "admins write audit logs"
on admin_audit_logs for insert
with check (public.is_teacher_or_system_admin());

create policy "users create own help requests"
on help_requests for insert
with check (requester_id = public.current_profile_id());

create policy "users read own help requests"
on help_requests for select
using (requester_id = public.current_profile_id() or public.is_teacher_or_system_admin());

create policy "admins manage help requests"
on help_requests for update
using (public.is_teacher_or_system_admin())
with check (public.is_teacher_or_system_admin());

create policy "admins manage ai documents"
on ai_documents for all
using (public.is_teacher_or_system_admin())
with check (public.is_teacher_or_system_admin());

create policy "admins manage ai chunks"
on ai_chunks for all
using (public.is_teacher_or_system_admin())
with check (public.is_teacher_or_system_admin());

create policy "students manage own ai conversations"
on ai_conversations for all
using (student_id = public.current_profile_id())
with check (student_id = public.current_profile_id());

create policy "students manage own ai messages"
on ai_messages for all
using (
  exists (
    select 1 from ai_conversations c
    where c.id = ai_messages.conversation_id
      and c.student_id = public.current_profile_id()
  )
)
with check (
  exists (
    select 1 from ai_conversations c
    where c.id = ai_messages.conversation_id
      and c.student_id = public.current_profile_id()
  )
);

create policy "admins manage ai ingestion jobs"
on ai_ingestion_jobs for all
using (public.is_teacher_or_system_admin())
with check (public.is_teacher_or_system_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('notes', 'notes', false, 52428800, array['application/pdf']),
  ('papers', 'papers', false, 52428800, array['application/pdf']),
  ('answers', 'answers', false, 52428800, array['application/pdf', 'video/mp4']),
  ('blog-images', 'blog-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('opportunity-images', 'opportunity-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('paper-3-videos', 'paper-3-videos', false, 524288000, array['video/mp4', 'video/webm'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "admins upload content storage"
on storage.objects for insert
with check (
  bucket_id in ('notes', 'papers', 'answers', 'blog-images', 'opportunity-images', 'paper-3-videos')
  and public.is_teacher_or_system_admin()
);

create policy "admins manage content storage"
on storage.objects for update
using (
  bucket_id in ('notes', 'papers', 'answers', 'blog-images', 'opportunity-images', 'paper-3-videos')
  and public.is_teacher_or_system_admin()
);

create policy "public read public image buckets"
on storage.objects for select
using (bucket_id in ('blog-images', 'opportunity-images'));

create policy "authenticated read protected content storage"
on storage.objects for select
using (
  auth.role() = 'authenticated'
  and bucket_id in ('notes', 'papers', 'answers', 'paper-3-videos')
);

insert into achievements (code, title, description, icon)
values
  ('first_quiz', 'First Quiz', 'Completed your first Bright Lamda quiz.', 'clipboard-check-outline'),
  ('seven_day_streak', 'Seven Day Streak', 'Studied for seven days in a row.', 'fire'),
  ('first_download', 'First Download', 'Downloaded your first approved resource.', 'download-outline')
on conflict (code) do nothing;


