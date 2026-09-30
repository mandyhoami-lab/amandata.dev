-- amandata.dev blog schema — run this in the Supabase SQL editor (one time).
--
-- After running:
--   1. Create your author account: Supabase dashboard → Authentication → Users → "Add user".
--   2. Sign in once at amandata.dev/admin.html to confirm it works.
--   3. Turn OFF public sign-ups: Authentication → Settings → uncheck "Allow new users to sign up",
--      so only your account can publish.

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null,          -- markdown
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

-- everyone can read published posts
drop policy if exists "public can read published posts" on posts;
create policy "public can read published posts"
  on posts for select
  using (published = true);

-- only the signed-in author can create / edit / delete
drop policy if exists "author can manage posts" on posts;
create policy "author can manage posts"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
