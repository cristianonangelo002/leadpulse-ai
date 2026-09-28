-- Execute uma vez no SQL Editor do projeto Supabase já existente.
alter table public.leads
add column if not exists google_maps_url text;
