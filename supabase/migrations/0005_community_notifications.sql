do $$ begin
  create type notification_sender_type as enum ('student', 'teacher_admin', 'system_admin', 'bright_ai');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_reason as enum ('announcement', 'quiz_reminder', 'forum_reply', 'ai_message', 'new_content', 'competition', 'opportunity', 'system');
exception when duplicate_object then null; end $$;

alter table notifications
  add column if not exists sender_id uuid references profiles(id) on delete set null,
  add column if not exists sender_type notification_sender_type not null default 'system_admin',
  add column if not exists sender_name text,
  add column if not exists reason notification_reason not null default 'announcement';

create index if not exists idx_notifications_reason on notifications(reason, created_at desc);
create index if not exists idx_notifications_sender on notifications(sender_type, sender_id, created_at desc);
create index if not exists idx_forum_channel_created on forum_posts(channel, created_at desc);
