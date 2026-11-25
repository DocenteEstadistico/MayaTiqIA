-- ============================================================
-- Pegasus Assistant — Esquema Supabase
-- ============================================================
-- Guarda las conversaciones del Ing. Pegasus para que los
-- profesores puedan ver qué preguntan los estudiantes, qué
-- preguntas NO están en el banco (fallback = true), y crecer
-- el banco con datos reales de uso.
--
-- Ejecutar en Supabase: SQL Editor > New Query > pegar > Run.
-- ============================================================

-- Tabla principal de conversaciones
create table if not exists public.pegasus_conversations (
  id              uuid primary key default gen_random_uuid(),
  student_id      text,                              -- opcional: ID del estudiante si hay auth
  mode            text not null check (mode in ('campo','clases','internado')),
  avatar          text check (avatar in ('agro','agi')),
  question        text not null,                     -- lo que escribió el estudiante
  matched_q       text,                              -- la pregunta del banco que matcheó (null si fallback)
  answer          text not null,                     -- respuesta de Pegasus
  fallback        boolean default false,             -- true si cayó en el mensaje genérico
  created_at      timestamptz default now()
);

-- Índices útiles para la pantalla del profesor
create index if not exists idx_pegasus_mode on public.pegasus_conversations(mode);
create index if not exists idx_pegasus_fallback on public.pegasus_conversations(fallback) where fallback = true;
create index if not exists idx_pegasus_created on public.pegasus_conversations(created_at desc);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
-- MVP: cualquiera con la ANON key puede INSERTAR (logging),
-- pero solo roles autenticados pueden LEER.
-- Ajústalo cuando metamos auth para estudiantes.
-- ============================================================
alter table public.pegasus_conversations enable row level security;

-- Insert público (el frontend usa anon key)
drop policy if exists "pegasus_insert_public" on public.pegasus_conversations;
create policy "pegasus_insert_public"
  on public.pegasus_conversations
  for insert
  with check (true);

-- Lectura solo autenticados (profesores)
drop policy if exists "pegasus_read_authenticated" on public.pegasus_conversations;
create policy "pegasus_read_authenticated"
  on public.pegasus_conversations
  for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- Vistas útiles para dashboard del profesor
-- ============================================================

-- Top preguntas no cubiertas (candidatas a agregar al banco)
create or replace view public.pegasus_unmatched_questions as
select
  question,
  count(*) as veces,
  max(created_at) as ultima
from public.pegasus_conversations
where fallback = true
group by question
order by count(*) desc, max(created_at) desc;

-- Volumen diario por modo
create or replace view public.pegasus_daily_usage as
select
  date_trunc('day', created_at)::date as dia,
  mode,
  count(*) as preguntas,
  sum(case when fallback then 1 else 0 end) as fallbacks
from public.pegasus_conversations
group by date_trunc('day', created_at)::date, mode
order by dia desc, mode;
