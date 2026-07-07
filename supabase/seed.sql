-- Bright Lamda development seed data.
-- Run with: supabase db reset, or psql against a local development database.

insert into subjects (name, slug)
values
  ('Physics', 'physics'),
  ('Mathematics', 'mathematics'),
  ('Chemistry', 'chemistry'),
  ('Biology', 'biology'),
  ('ICT', 'ict')
on conflict (slug) do update set name = excluded.name;

insert into learning_categories (id, title, description)
values
  ('ordinary_physics', 'Ordinary Level Physics', 'Cameroon Ordinary Level Physics foundations, practicals, and GCE preparation.'),
  ('advanced_physics', 'Advanced Level Physics', 'Advanced Physics concepts, structured problems, and practical exam support.'),
  ('competitive_physics', 'Competitive Entrance Examination Physics', 'FET, Polytechnic, ENS, ENSET, and other entrance examination Physics preparation.')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description;

insert into achievements (code, title, description, icon)
values
  ('first_quiz', 'First Quiz', 'Completed your first Bright Lamda quiz.', 'clipboard-check-outline'),
  ('seven_day_streak', 'Seven Day Streak', 'Studied for seven days in a row.', 'fire'),
  ('first_download', 'First Download', 'Downloaded your first approved resource.', 'download-outline'),
  ('forum_voice', 'Forum Voice', 'Contributed your first thoughtful forum message.', 'forum-outline')
on conflict (code) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon;
