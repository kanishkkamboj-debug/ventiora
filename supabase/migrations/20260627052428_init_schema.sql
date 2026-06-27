-- Ventiora Base Schema
-- Extensions
create extension if not exists "uuid-ossp";

-- 1. ENUMS
create type user_role as enum ('STUDENT', 'MODERATOR', 'ADMIN');
create type target_type as enum ('POST', 'COMMENT');
create type report_status as enum ('PENDING', 'ACCEPTED', 'REJECTED');

-- 2. USERS TABLE
create table public.users (
  id uuid references auth.users(id) on delete cascade not null primary key,
  username text unique not null,
  email text unique not null,
  avatar_url text,
  bio text,
  role user_role default 'STUDENT'::user_role not null,
  is_banned boolean default false not null,
  is_suspended boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CATEGORIES TABLE
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  emoji text not null,
  description text,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. POSTS TABLE
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete restrict not null,
  title text not null,
  content text not null,
  image_url text,
  is_anonymous boolean default false not null,
  is_pinned boolean default false not null,
  is_featured boolean default false not null,
  comments_locked boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. COMMENTS TABLE
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  is_anonymous boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. REACTIONS TABLE
create table public.reactions (
  id uuid default uuid_generate_v4() primary key,
  target_type target_type not null,
  target_id uuid not null, -- can't easily FK to polymorphic types in basic SQL
  user_id uuid references public.users(id) on delete cascade not null,
  reaction_type text not null, -- e.g. LIKE, LOVE, FUNNY, SAD, ANGRY
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(target_type, target_id, user_id)
);

-- 7. REPORTS TABLE
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  target_type target_type not null,
  target_id uuid not null,
  reporter_id uuid references public.users(id) on delete cascade not null,
  reason text not null, -- e.g. SELF_HARM_CONCERN, SPAM, HARASSMENT
  status report_status default 'PENDING'::report_status not null,
  resolved_by uuid references public.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. TAGS & POST_TAGS
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null
);

create table public.post_tags (
  post_id uuid references public.posts(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  primary key (post_id, tag_id)
);

-- 9. ANNOUNCEMENTS TABLE
create table public.announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  created_by uuid references public.users(id) on delete set null,
  is_important boolean default false not null,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. NOTIFICATIONS TABLE
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null,
  message text not null,
  link text,
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. ADMIN AUDIT LOG TABLE
create table public.admin_audit_log (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_posts_user on public.posts(user_id);
create index idx_posts_category on public.posts(category_id);
create index idx_posts_created_at on public.posts(created_at desc);
create index idx_comments_post on public.comments(post_id);
create index idx_comments_user on public.comments(user_id);
create index idx_reactions_target on public.reactions(target_type, target_id);
create index idx_reports_status on public.reports(status, created_at);
create index idx_notifications_user on public.notifications(user_id, created_at desc);
