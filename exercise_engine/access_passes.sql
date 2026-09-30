-- MAYAN TECH IA · Pases de acceso de un solo uso, con duración configurable
-- Ejecutar una vez en el SQL Editor del proyecto Supabase.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.access_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  label text not null default '',
  duration_days integer not null check (duration_days between 1 and 36500),
  issued_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  redeemed_by uuid references auth.users(id),
  redeemed_at timestamptz,
  revoked_at timestamptz,
  constraint access_codes_redemption_pair check (
    (redeemed_by is null and redeemed_at is null)
    or (redeemed_by is not null and redeemed_at is not null)
  )
);

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  access_code_id uuid unique references public.access_codes(id),
  source text not null check (source in ('code', 'manual', 'payment')),
  starts_at timestamptz not null default now(),
  access_until timestamptz not null,
  created_at timestamptz not null default now(),
  constraint access_grants_valid_window check (access_until > starts_at)
);

create index if not exists access_grants_user_until_idx
  on public.access_grants (user_id, access_until desc);
create index if not exists access_codes_issued_at_idx
  on public.access_codes (issued_by, created_at desc);

alter table public.access_admins enable row level security;
alter table public.access_codes enable row level security;
alter table public.access_grants enable row level security;

revoke all on public.access_admins from anon, authenticated;
revoke all on public.access_codes from anon, authenticated;
revoke all on public.access_grants from anon, authenticated;
grant select on public.access_grants to authenticated;

drop policy if exists access_grants_select_own on public.access_grants;
create policy access_grants_select_own
on public.access_grants for select to authenticated
using (user_id = auth.uid());

create or replace function public.is_access_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1 from public.access_admins where user_id = auth.uid()
  );
$$;

create or replace function public.has_active_access()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null and (
    public.is_access_admin()
    or exists (
      select 1
      from public.access_grants
      where user_id = auth.uid()
        and starts_at <= now()
        and access_until > now()
    )
  );
$$;

create or replace function public.get_my_access_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_access_until timestamptz;
  v_is_admin boolean;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión para consultar el acceso.'
      using errcode = '28000';
  end if;

  select max(access_until)
    into v_access_until
  from public.access_grants
  where user_id = auth.uid()
    and starts_at <= now()
    and access_until > now();

  v_is_admin := public.is_access_admin();

  return jsonb_build_object(
    'active', v_access_until is not null or v_is_admin,
    'access_until', v_access_until,
    'days_remaining', case
      when v_access_until is null then 0
      else greatest(1, ceil(extract(epoch from (v_access_until - now())) / 86400)::integer)
    end,
    'is_admin', v_is_admin
  );
end;
$$;

create or replace function public.create_access_codes(
  p_count integer,
  p_duration_days integer,
  p_label text default ''
)
returns table (code text, duration_days integer, label text)
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_index integer;
  v_code text;
  v_label text := left(btrim(coalesce(p_label, '')), 120);
begin
  if auth.uid() is null or not public.is_access_admin() then
    raise exception 'No tienes permiso para emitir códigos.'
      using errcode = '42501';
  end if;
  if p_count is null or p_count < 1 or p_count > 500 then
    raise exception 'La cantidad debe estar entre 1 y 500.'
      using errcode = '22023';
  end if;
  if p_duration_days is null or p_duration_days < 1 or p_duration_days > 36500 then
    raise exception 'La duración debe estar entre 1 y 36500 días.'
      using errcode = '22023';
  end if;

  for v_index in 1..p_count loop
    v_code := 'MAYAN-' || upper(encode(extensions.gen_random_bytes(12), 'hex'));
    insert into public.access_codes (code_hash, label, duration_days, issued_by)
    values (
      encode(extensions.digest(v_code, 'sha256'), 'hex'),
      v_label,
      p_duration_days,
      auth.uid()
    );
    code := v_code;
    duration_days := p_duration_days;
    label := v_label;
    return next;
  end loop;
end;
$$;

create or replace function public.redeem_access_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_code public.access_codes%rowtype;
  v_current_until timestamptz;
  v_new_until timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión antes de canjear un código.'
      using errcode = '28000';
  end if;
  if p_code is null or length(btrim(p_code)) < 10 or length(btrim(p_code)) > 100 then
    raise exception 'El código no es válido.'
      using errcode = '22023';
  end if;

  insert into public.students (id)
  values (auth.uid())
  on conflict (id) do nothing;

  perform 1 from public.students where id = auth.uid() for update;

  select *
    into v_code
  from public.access_codes
  where code_hash = encode(extensions.digest(upper(btrim(p_code)), 'sha256'), 'hex')
    and redeemed_at is null
    and revoked_at is null
  for update;

  if not found then
    raise exception 'El código es incorrecto, ya fue utilizado o fue revocado.'
      using errcode = '22023';
  end if;

  select max(access_until)
    into v_current_until
  from public.access_grants
  where user_id = auth.uid()
    and starts_at <= now()
    and access_until > now();

  v_new_until := greatest(now(), coalesce(v_current_until, now()))
    + make_interval(days => v_code.duration_days);

  update public.access_codes
  set redeemed_by = auth.uid(), redeemed_at = now()
  where id = v_code.id;

  insert into public.access_grants (
    user_id, access_code_id, source, starts_at, access_until
  )
  values (auth.uid(), v_code.id, 'code', now(), v_new_until);

  return jsonb_build_object(
    'active', true,
    'access_until', v_new_until,
    'days_remaining', v_code.duration_days,
    'label', v_code.label
  );
end;
$$;

revoke all on function public.is_access_admin() from public, anon;
revoke all on function public.has_active_access() from public, anon;
revoke all on function public.get_my_access_status() from public, anon;
revoke all on function public.create_access_codes(integer, integer, text) from public, anon;
revoke all on function public.redeem_access_code(text) from public, anon;
grant execute on function public.is_access_admin() to authenticated;
grant execute on function public.has_active_access() to authenticated;
grant execute on function public.get_my_access_status() to authenticated;
grant execute on function public.create_access_codes(integer, integer, text) to authenticated;
grant execute on function public.redeem_access_code(text) to authenticated;

-- Bootstrap del administrador: reemplaza el correo antes de ejecutar esta sentencia.
-- insert into public.access_admins (user_id)
-- select id from auth.users where lower(email) = lower('TU_CORREO_ADMIN')
-- on conflict (user_id) do nothing;

-- Elimina la política anterior si se instaló el esquema v1.1.
drop policy if exists exercise_visible_by_profile on public.exercises;
create policy exercise_visible_by_profile
on public.exercises for select to authenticated
using (
  status = 'approved'
  and public.has_active_access()
);
