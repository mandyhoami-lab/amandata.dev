-- Blog comments + reactions for amandata.dev (Supabase project amandata-blog).
-- No sign-in: anyone can read and post with a display name.
-- Run in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- RLS: anon can SELECT and INSERT only. No update or delete.
-- Safe to run twice: tables, indexes and policies are all IF NOT EXISTS / dropped first.

create table if not exists public.blog_comments (
  id bigint generated always as identity primary key,
  post_slug text not null,
  author_name text not null check (char_length(author_name) between 1 and 50),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.blog_reactions (
  id bigint generated always as identity primary key,
  post_slug text not null,
  emoji text not null check (emoji in ('👍', '❤️', '🎉', '🤔')),
  created_at timestamptz not null default now()
);

create index if not exists blog_comments_post_slug_idx
  on public.blog_comments (post_slug, created_at);
create index if not exists blog_reactions_post_slug_idx
  on public.blog_reactions (post_slug);

alter table public.blog_comments enable row level security;
alter table public.blog_reactions enable row level security;

drop policy if exists "anyone can read comments" on public.blog_comments;
create policy "anyone can read comments" on public.blog_comments
  for select to anon using (true);
drop policy if exists "anyone can post comments" on public.blog_comments;
create policy "anyone can post comments" on public.blog_comments
  for insert to anon with check (true);

drop policy if exists "anyone can read reactions" on public.blog_reactions;
create policy "anyone can read reactions" on public.blog_reactions
  for select to anon using (true);
drop policy if exists "anyone can post reactions" on public.blog_reactions;
create policy "anyone can post reactions" on public.blog_reactions
  for insert to anon with check (true);

grant select, insert on public.blog_comments to anon;
grant select, insert on public.blog_reactions to anon;
