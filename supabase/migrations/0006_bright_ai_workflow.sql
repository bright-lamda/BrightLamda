create index if not exists idx_ai_conversations_student_created on ai_conversations(student_id, created_at desc);
create index if not exists idx_ai_messages_conversation_created on ai_messages(conversation_id, created_at asc);
create index if not exists idx_ai_ingestion_jobs_content_status on ai_ingestion_jobs(content_item_id, status);

create unique index if not exists idx_ai_ingestion_jobs_active_content
on ai_ingestion_jobs(content_item_id)
where status in ('queued', 'extracting', 'embedding');
