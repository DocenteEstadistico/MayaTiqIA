-- MAYAN TECH IA · Esquema del Banco de Ejercicios + RBAC · v1.1
-- Ejecutar en el SQL Editor de Supabase

-- ═══════════ ESTUDIANTES / PERFIL ═══════════

create table if not exists students (
  id         uuid primary key references auth.users(id) on delete cascade,
  profile    text not null default 'basicos',
  created_at timestamptz default now()
);

-- Helper: perfil del usuario autenticado (1 query, sin recursión de RLS).
create or replace function student_profile()
returns text
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select profile from students where id = auth.uid() limit 1),
    'anon'
  );
$$;

-- ═══════════ EJERCICIOS ═══════════

create table if not exists exercises (
  exercise_id     text primary key,
  source          text not null default 'mayan_generator',
  license         text not null,
  attribution     text,
  source_url      text,
  subject         text not null default 'matematicas',
  topic           text not null,
  subtopic        text not null,
  difficulty      numeric(3,1) not null,
  grade_level     text,
  profiles        text[] not null default '{}',
  resource_track  text default 'matematicas',
  estimated_time  int,
  question        text not null,
  question_latex  text,
  answer          jsonb,
  answer_display  text,
  choices         jsonb,
  correct_index   int,
  explanation     text,
  skills          text[] default '{}',
  language        text default 'es',
  answer_type     text default 'numeric',
  verified_by     text default 'none',
  cas_checkable   boolean default false,
  status          text default 'pending_review',
  template_id     text,
  variant_params  jsonb,
  content_hash    text unique,
  created_at      timestamptz default now()
);

create index if not exists idx_ex_topics   on exercises (topic, difficulty);
create index if not exists idx_ex_profiles on exercises using gin (profiles);
create index if not exists idx_ex_skills   on exercises using gin (skills);
create index if not exists idx_ex_status   on exercises (status);

-- ═══════════ RBAC: matriz de permisos ═══════════

create table if not exists profile_permissions (
  profile   text not null,
  resource  text not null,
  allowed   boolean not null default true,
  primary key (profile, resource)
);

insert into profile_permissions (profile, resource, allowed) values
  ('basicos',         'matematicas',             true),
  ('basicos',         'simulador_paa',           false),
  ('basicos',         'calculo',                 false),
  ('bachillerato',    'matematicas',             true),
  ('bachillerato',    'simulador_paa',           false),
  ('bachillerato',    'calculo',                 false),
  ('admision_uni',    'matematicas',             true),
  ('admision_uni',    'simulador_paa',           true),
  ('universitario',   'matematicas',             true),
  ('universitario',   'calculo',                 true),
  ('universitario',   'simulador_paa',           true),
  ('tesista',         'estadistica_inferencial', true)
on conflict do nothing;

-- ═══════════ RLS ═══════════

alter table exercises enable row level security;

create policy "exercise_visible_by_profile"
on exercises for select
using (
  status = 'approved'
  and profiles @> array[student_profile()]
);

alter table profile_permissions enable row level security;
create policy "permissions_readable"
on profile_permissions for select using (true);

-- ═══════════ INTENTOS DE ESTUDIANTES ═══════════

create table if not exists attempts (
  id            bigint generated always as identity primary key,
  student_id    uuid not null references auth.users(id),
  exercise_id   text references exercises(exercise_id),
  response      text,
  correct       boolean,
  time_seconds  int,
  steps_partial jsonb,
  created_at    timestamptz default now()
);
create index if not exists idx_attempts_student on attempts (student_id, created_at desc);

alter table attempts enable row level security;
create policy "attempts_insert_own" on attempts
for insert with check (student_id = auth.uid());
create policy "attempts_select_own" on attempts
for select using (student_id = auth.uid());
create policy "attempts_update_own" on attempts
for update using (student_id = auth.uid());
