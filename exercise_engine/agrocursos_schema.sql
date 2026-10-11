-- Esquema base para Agrocursos & Red de Especialistas
-- Compatible con Supabase y con el diseño actual del producto MayaTiqIA.

create extension if not exists "pgcrypto";

create table if not exists public.instructors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  association_badge text not null,
  specialties text[] not null default '{}',
  profile_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null default 'agronomy' check (category in ('agronomy', 'agrotech', 'agri-business')),
  instructor_name text not null,
  association_badge text not null,
  target_audience text[] not null default '{}',
  enrolled_count integer not null default 0,
  rating numeric(3,2) not null default 0,
  modules_count integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  instructor_id uuid references public.instructors(id) on delete set null
);

create index if not exists idx_courses_category
  on public.courses(category);

create index if not exists idx_courses_featured
  on public.courses(is_featured);

create index if not exists idx_instructors_association
  on public.instructors(association_badge);

alter table public.instructors
  enable row level security;

alter table public.courses
  enable row level security;

create policy "Public read for instructors"
  on public.instructors for select
  using (true);

create policy "Public read for courses"
  on public.courses for select
  using (true);

-- Ejemplo de registros base
insert into public.instructors (full_name, role, association_badge, specialties, is_verified)
values
  ('Ana Morales', 'Especialista en Agricultura de Precisión', 'Asociación de Egresados Zamorano', array['agrotech', 'sensores', 'riego'], true),
  ('Luis Cárdenas', 'Ingeniero Agrónomo', 'Red CATIE', array['suelo', 'fertilidad', 'agronomía'], true),
  ('Rosa Mejía', 'Mentora de agroemprendimiento', 'Alianza Gremiada', array['mercados', 'pymes', 'innovación'], true)
on conflict do nothing;

insert into public.courses (
  title,
  description,
  category,
  instructor_name,
  association_badge,
  target_audience,
  enrolled_count,
  rating,
  modules_count,
  is_featured
)
values
  (
    'Agricultura de Precisión con IA',
    'Curso orientado a interpretar datos de campo, sensores y análisis para mejorar decisiones agronómicas.',
    'agrotech',
    'Ana Morales',
    'Asociación de Egresados Zamorano',
    array['Estudiantes técnicos', 'Jóvenes agrónomos', 'Productores rurales'],
    420,
    4.9,
    6,
    true
  ),
  (
    'Salud del Suelo y Biofertilidad',
    'Diagnóstico, manejo orgánico y mejora de la calidad de suelos para sistemas sostenibles.',
    'agronomy',
    'Luis Cárdenas',
    'Red CATIE',
    array['Técnicos agrícolas', 'Agrónomos', 'Estudiantes de ciencias aplicadas'],
    285,
    4.8,
    5,
    false
  ),
  (
    'Logística Verde y Mercados Agrícolas',
    'Estrategias para fortalecer cadenas de valor, trazabilidad y emprendimientos agrícolas.',
    'agri-business',
    'Rosa Mejía',
    'Alianza Gremiada',
    array['Emprendedores', 'Técnicos de campo', 'Estudiantes de agroindustria'],
    312,
    4.7,
    4,
    false
  )
on conflict do nothing;
