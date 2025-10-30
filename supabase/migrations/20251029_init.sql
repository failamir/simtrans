-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Citizens table
create table if not exists public.citizens (
  id uuid primary key default gen_random_uuid(),
  nik text not null unique,
  name text not null,
  birth_place text not null,
  birth_date date not null,
  gender text check (gender in ('male','female')) not null,
  address text not null,
  district text not null,
  city text not null,
  province text not null,
  postal_code text not null,
  phone text,
  email text,
  marital_status text check (marital_status in ('single','married','divorced','widowed')) not null,
  religion text not null,
  occupation text not null,
  education text not null,
  region_kabupaten text,
  region_kawasan text,
  region_upt text,
  region_blok text,
  photo_url text,
  migration_move_date date,
  migration_type text,
  migration_origin_province text,
  migration_origin_regency text,
  migration_origin_district text,
  migration_origin_village text,
  migration_destination_province text,
  migration_destination_regency text,
  migration_destination_district text,
  migration_destination_village text,
  facilities_usaha1_area text,
  facilities_usaha1_coordinates text,
  facilities_usaha1_house_type text,
  facilities_usaha2_area text,
  facilities_usaha2_coordinates text,
  facilities_usaha2_house_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- Family members table
create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid not null references public.citizens(id) on delete cascade,
  nik text,
  name text not null,
  birth_place text,
  birth_date date,
  gender text check (gender in ('male','female')),
  marital_status text check (marital_status in ('single','married','divorced','widowed')),
  religion text,
  occupation text,
  education text,
  phone text,
  email text,
  relation_to_head text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger citizens_set_updated_at
before update on public.citizens
for each row execute function public.set_updated_at();

create trigger family_members_set_updated_at
before update on public.family_members
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.citizens enable row level security;
alter table public.family_members enable row level security;

-- Policies: anyone can read, only authenticated can write their own
create policy "Citizens read anon" on public.citizens for select using (true);
create policy "Family members read anon" on public.family_members for select using (true);

create policy "Citizens insert by auth" on public.citizens
for insert to authenticated
with check (auth.uid() = created_by);

create policy "Citizens update by owner" on public.citizens
for update to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

create policy "Citizens delete by owner" on public.citizens
for delete to authenticated
using (auth.uid() = created_by);

create policy "Family insert by auth" on public.family_members
for insert to authenticated
with check (exists (
  select 1 from public.citizens c where c.id = citizen_id and c.created_by = auth.uid()
));

create policy "Family update by owner" on public.family_members
for update to authenticated
using (exists (
  select 1 from public.citizens c where c.id = citizen_id and c.created_by = auth.uid()
))
with check (exists (
  select 1 from public.citizens c where c.id = citizen_id and c.created_by = auth.uid()
));

create policy "Family delete by owner" on public.family_members
for delete to authenticated
using (exists (
  select 1 from public.citizens c where c.id = citizen_id and c.created_by = auth.uid()
));
