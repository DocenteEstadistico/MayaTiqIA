-- Freemium access: authenticated accounts can read ten approved samples per topic.
-- Run after sqlesquema.sql and access_passes.sql in the Supabase SQL Editor.

alter table public.exercises
  add column if not exists is_free_preview boolean not null default false;

with ranked_previews as (
  select
    exercise_id,
    row_number() over (partition by topic order by exercise_id) as topic_position
  from public.exercises
  where status = 'approved'
)
update public.exercises as exercise
set is_free_preview = (ranked_previews.topic_position <= 10)
from ranked_previews
where exercise.exercise_id = ranked_previews.exercise_id
  and exercise.is_free_preview is distinct from (ranked_previews.topic_position <= 10);

create or replace function public.create_student_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.students (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists create_student_after_signup on auth.users;
create trigger create_student_after_signup
after insert on auth.users
for each row execute function public.create_student_for_new_user();

insert into public.students (id)
select id from auth.users
on conflict (id) do nothing;

drop policy if exists exercise_visible_by_profile on public.exercises;
create policy exercise_visible_by_profile
on public.exercises for select to authenticated
using (
  status = 'approved'
  and (is_free_preview or public.has_active_access())
);
