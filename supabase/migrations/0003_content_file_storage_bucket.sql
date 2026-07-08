alter table content_files
  add column if not exists storage_bucket text not null default 'notes';

alter table content_files
  drop constraint if exists content_files_storage_path_key;

alter table content_files
  add constraint content_files_storage_bucket_path_key unique (storage_bucket, storage_path);

create index if not exists idx_content_files_bucket_path on content_files(storage_bucket, storage_path);
