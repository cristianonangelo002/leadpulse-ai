-- LeadPulse AI — execute no SQL Editor do Supabase.
create extension if not exists pgcrypto;

do $$ begin
  create type public.lead_status as enum ('capturado', 'qualificado', 'contato', 'reuniao', 'ganho', 'perdido');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('serper', 'google_places', 'openai', 'gemini')),
  api_key text not null check (char_length(api_key) >= 8),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  phone text,
  address text,
  website text,
  rating numeric(2,1) check (rating between 0 and 5),
  status public.lead_status not null default 'capturado',
  ai_score integer check (ai_score between 0 and 100),
  ai_summary text,
  ai_pitch text,
  meeting_notes text,
  created_at timestamptz not null default now()
);

create index if not exists leads_user_status_idx on public.leads(user_id, status);
create index if not exists integrations_user_idx on public.user_integrations(user_id);

alter table public.profiles enable row level security;
alter table public.user_integrations enable row level security;
alter table public.leads enable row level security;

-- O usuário autenticado só enxerga e altera as próprias linhas.
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "integrations_select_own" on public.user_integrations for select using (auth.uid() = user_id);
create policy "integrations_insert_own" on public.user_integrations for insert with check (auth.uid() = user_id);
create policy "integrations_update_own" on public.user_integrations for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "integrations_delete_own" on public.user_integrations for delete using (auth.uid() = user_id);
create policy "leads_select_own" on public.leads for select using (auth.uid() = user_id);
create policy "leads_insert_own" on public.leads for insert with check (auth.uid() = user_id);
create policy "leads_update_own" on public.leads for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "leads_delete_own" on public.leads for delete using (auth.uid() = user_id);

-- Cria o perfil automaticamente no cadastro.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.email, ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- updated_at confiável no banco.
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists integrations_set_updated_at on public.user_integrations;
create trigger integrations_set_updated_at before update on public.user_integrations
for each row execute procedure public.set_updated_at();

revoke all on public.user_integrations from anon;
grant select, insert, update, delete on public.user_integrations to authenticated;
grant select, insert, update, delete on public.leads to authenticated;
grant select, update on public.profiles to authenticated;
