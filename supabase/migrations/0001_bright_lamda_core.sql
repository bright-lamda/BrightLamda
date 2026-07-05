create extension if not exists "uuid-ossp";
create extension if not exists vector;

do $$ begin
  create type app_role as enum ('student', 'teacher_admin', 'system_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type education_category as enum ('ordinary_physics', 'advanced_physics', 'competitive_physics');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_type as enum ('note', 'paper', 'answer', 'physics_blog', 'bfa_horizons');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_status as enum ('draft', 'pending_review', 'approved', 'rejected', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type paper_kind as enum ('paper_1', 'paper_2', 'paper_3');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_type as enum ('announcement', 'quiz_reminder', 'forum_reply', 'ai', 'content_upload');
exception when duplicate_object then null; end $$;

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid unique,
  full_name text not null,
  email text unique not null,
  whatsapp_number text,
  role app_role not null default 'student',
  education_category education_category,
  school text,
  region text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_invitations (
  id uuid primary key default uuid_generate_v4(),
  invited_by uuid not null references profiles(id),
  full_name text not null,
  email text not null,
  whatsapp_number text,
  role app_role not null check (role in ('teacher_admin', 'system_admin')),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists subjects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists learning_categories (
  id education_category primary key,
  title text not null,
  description text not null,
  is_active boolean not null default true
);

create table if not exists student_subjects (
  student_id uuid references profiles(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, subject_id)
);

create table if not exists content_items (
  id uuid primary key default uuid_generate_v4(),
  type content_type not null,
  title text not null,
  body text,
  image_url text,
  education_category education_category,
  subject_id uuid references subjects(id),
  paper_kind paper_kind,
  visible_in_forum boolean not null default false,
  forum_display_name text,
  status content_status not null default 'draft',
  author_id uuid not null references profiles(id),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_files (
  id uuid primary key default uuid_generate_v4(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  storage_path text not null,
  mime_type text not null,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists quizzes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  mode text not null check (mode in ('weekly', 'topic', 'competition')),
  education_category education_category,
  subject_id uuid references subjects(id),
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  question text not null,
  options jsonb not null,
  correct_answer text not null,
  explanation text not null,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id),
  student_id uuid not null references profiles(id),
  score numeric(5, 2) not null default 0,
  answers jsonb not null default '[]',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists forum_posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references profiles(id),
  content_item_id uuid references content_items(id),
  channel text not null default 'general',
  display_name text,
  title text,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  recipient_id uuid references profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists saved_resources (
  student_id uuid references profiles(id) on delete cascade,
  content_item_id uuid references content_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, content_item_id)
);

create table if not exists downloads (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references profiles(id) on delete cascade,
  content_file_id uuid references content_files(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists ai_documents (
  id uuid primary key default uuid_generate_v4(),
  content_item_id uuid references content_items(id) on delete cascade,
  title text not null,
  source_path text,
  created_at timestamptz not null default now()
);

create table if not exists ai_chunks (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references ai_documents(id) on delete cascade,
  content text not null,
  token_count integer,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create table if not exists ai_conversations (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create table if not exists ai_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  citations jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_content_status_type on content_items(status, type);
create index if not exists idx_content_education on content_items(education_category);
create index if not exists idx_forum_created on forum_posts(created_at desc);
create index if not exists idx_notifications_recipient on notifications(recipient_id, read_at, created_at desc);
create index if not exists idx_ai_chunks_embedding on ai_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

insert into subjects (name, slug)
values ('Physics', 'physics')
on conflict (slug) do nothing;

insert into learning_categories (id, title, description)
values
  ('ordinary_physics', 'Ordinary Level Physics', 'Cameroon Ordinary Level Physics'),
  ('advanced_physics', 'Advanced Level Physics', 'Cameroon Advanced Level Physics'),
  ('competitive_physics', 'Competitive Entrance Examination Physics', 'FET, Polytechnic, ENS, ENSET, and other entrance examination preparation')
on conflict (id) do nothing;

alter table profiles enable row level security;
alter table subjects enable row level security;
alter table learning_categories enable row level security;
alter table content_items enable row level security;
alter table content_files enable row level security;
alter table forum_posts enable row level security;
alter table notifications enable row level security;
alter table saved_resources enable row level security;
alter table downloads enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;

create policy "public active subjects"
on subjects for select
using (is_active = true);

create policy "public active learning categories"
on learning_categories for select
using (is_active = true);

create policy "students read approved content"
on content_items for select
using (status = 'approved');

create policy "users read forum posts"
on forum_posts for select
using (true);

create policy "users read own notifications"
on notifications for select
using (recipient_id = auth.uid());
