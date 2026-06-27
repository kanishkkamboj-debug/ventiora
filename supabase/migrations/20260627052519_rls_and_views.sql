-- 1. Helper Function: Check Admin/Moderator Status
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = user_id
    and role in ('ADMIN', 'MODERATOR')
  );
$$;

-- 2. Enable RLS on all tables
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.reports enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.announcements enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_audit_log enable row level security;

-- 3. RLS Policies

-- Users
create policy "users are publicly readable" on public.users for select using (true);
create policy "users can update their own profile" on public.users for update using (auth.uid() = id);

-- Categories & Tags
create policy "categories are publicly readable" on public.categories for select using (true);
create policy "tags are publicly readable" on public.tags for select using (true);

-- Posts
create policy "posts are publicly readable" on public.posts for select using (true);
create policy "users can insert posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "owners can update their own posts" on public.posts for update using (auth.uid() = user_id);
create policy "owners can delete their own posts" on public.posts for delete using (auth.uid() = user_id);

-- Post Tags
create policy "post_tags are publicly readable" on public.post_tags for select using (true);
create policy "users can insert tags for their posts" on public.post_tags for insert with check (
  exists (select 1 from public.posts where id = post_id and user_id = auth.uid())
);
create policy "users can delete tags for their posts" on public.post_tags for delete using (
  exists (select 1 from public.posts where id = post_id and user_id = auth.uid())
);

-- Comments
create policy "comments are publicly readable" on public.comments for select using (true);
create policy "users can insert comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "owners can update their own comments" on public.comments for update using (auth.uid() = user_id);
create policy "owners can delete their own comments" on public.comments for delete using (auth.uid() = user_id);

-- Reactions
create policy "reactions are publicly readable" on public.reactions for select using (true);
create policy "users can insert their own reactions" on public.reactions for insert with check (auth.uid() = user_id);
create policy "owners can update their own reactions" on public.reactions for update using (auth.uid() = user_id);
create policy "owners can delete their own reactions" on public.reactions for delete using (auth.uid() = user_id);

-- Reports
create policy "admins can view all reports" on public.reports for select using (public.is_admin(auth.uid()));
create policy "users can insert reports" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "users can view their own reports" on public.reports for select using (auth.uid() = reporter_id);

-- Announcements
create policy "announcements are publicly readable" on public.announcements for select using (true);

-- Notifications
create policy "users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "users can update their own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "users can delete their own notifications" on public.notifications for delete using (auth.uid() = user_id);

-- Admin Audit Log
create policy "admins can view audit logs" on public.admin_audit_log for select using (public.is_admin(auth.uid()));

-- 4. Identity-Masking Views (Column-Level Security via Views)

create view public.posts_public
  with (security_invoker = true)
  as
select
  p.id, p.title, p.content, p.category_id, p.image_url, p.is_anonymous,
  p.is_pinned, p.is_featured, p.comments_locked, p.created_at, p.updated_at,
  case
    when p.is_anonymous and auth.uid() <> p.user_id and not public.is_admin(auth.uid())
      then null
    else p.user_id
  end as user_id,
  (auth.uid() = p.user_id) as is_owned_by_me,
  c.name as category_name,
  c.emoji as category_emoji,
  case 
    when p.is_anonymous and auth.uid() <> p.user_id and not public.is_admin(auth.uid()) then null 
    else u.username 
  end as author_username,
  case 
    when p.is_anonymous and auth.uid() <> p.user_id and not public.is_admin(auth.uid()) then null 
    else u.avatar_url 
  end as author_avatar_url
from public.posts p
left join public.categories c on p.category_id = c.id
left join public.users u on p.user_id = u.id;

create view public.comments_public
  with (security_invoker = true)
  as
select
  c.id, c.post_id, c.parent_id, c.content, c.is_anonymous, c.created_at, c.updated_at,
  case
    when c.is_anonymous and auth.uid() <> c.user_id and not public.is_admin(auth.uid())
      then null
    else c.user_id
  end as user_id,
  (auth.uid() = c.user_id) as is_owned_by_me,
  case 
    when c.is_anonymous and auth.uid() <> c.user_id and not public.is_admin(auth.uid()) then null 
    else u.username 
  end as author_username,
  case 
    when c.is_anonymous and auth.uid() <> c.user_id and not public.is_admin(auth.uid()) then null 
    else u.avatar_url 
  end as author_avatar_url
from public.comments c
left join public.users u on c.user_id = u.id;