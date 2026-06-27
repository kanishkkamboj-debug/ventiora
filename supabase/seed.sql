-- Supabase Seed Data for Ventiora

insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, is_super_admin)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'alex@university.edu', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"username": "alex_campus"}', now(), now(), 'authenticated', false),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'priya@university.edu', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"username": "priya_dev"}', now(), now(), 'authenticated', false),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'admin@university.edu', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"username": "admin_root"}', now(), now(), 'authenticated', false),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'banned@university.edu', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"username": "bad_user"}', now(), now(), 'authenticated', false),
  ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'suspended@university.edu', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{"username": "timeout_user"}', now(), now(), 'authenticated', false);


insert into public.users (id, username, email, avatar_url, bio, role, is_banned, is_suspended)
values
  ('11111111-1111-1111-1111-111111111111', 'alex_campus', 'alex@university.edu', null, 'CS senior. Loves coffee and distributed systems.', 'STUDENT', false, false),
  ('22222222-2222-2222-2222-222222222222', 'priya_dev', 'priya@university.edu', null, 'Design system enthusiast.', 'STUDENT', false, false),
  ('33333333-3333-3333-3333-333333333333', 'admin_root', 'admin@university.edu', null, 'Platform Administrator.', 'ADMIN', false, false),
  ('44444444-4444-4444-4444-444444444444', 'bad_user', 'banned@university.edu', null, 'I break rules.', 'STUDENT', true, false),
  ('55555555-5555-5555-5555-555555555555', 'timeout_user', 'suspended@university.edu', null, 'In timeout.', 'STUDENT', false, true);


insert into public.categories (id, name, emoji, description)
values
  ('a1111111-1111-1111-1111-111111111111', 'Studies', 'ðŸ“š', 'Academic discussions and study help'),
  ('a2222222-2222-2222-2222-222222222222', 'Placements', 'ðŸ’¼', 'Career, internships, and interviews'),
  ('a3333333-3333-3333-3333-333333333333', 'Mental Health', 'ðŸ˜”', 'Safe space for support'),
  ('a4444444-4444-4444-4444-444444444444', 'Relationships', 'â¤ï¸', 'Dating and friendships'),
  ('a5555555-5555-5555-5555-555555555555', 'College Life', 'ðŸ«', 'Dorm life and campus events'),
  ('a6666666-6666-6666-6666-666666666666', 'Memes', 'ðŸ˜‚', 'Campus humor'),
  ('a7777777-7777-7777-7777-777777777777', 'Gaming', 'ðŸŽ®', 'LFG and gaming talk'),
  ('a8888888-8888-8888-8888-888888888888', 'Finance', 'ðŸ’¸', 'Budgeting and student loans'),
  ('a9999999-9999-9999-9999-999999999999', 'Advice', 'ðŸ¤”', 'General advice'),
  ('a0000000-0000-0000-0000-000000000000', 'Confessions', 'ðŸ¤«', 'Anonymous confessions');

-- Posts
insert into public.posts (id, user_id, category_id, title, content, is_anonymous, is_pinned, is_featured)
values
  ('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'How to survive finals week with zero sleep', 'Just kidding, get some sleep. But really, any tips for staying awake?', false, true, true),
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'FAANG Interview Tips', 'I just passed my technical screen. Happy to answer questions!', false, false, true),
  ('b3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'Feeling completely burnt out', 'Is anyone else just tired of everything right now?', true, false, false),
  ('b4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'a0000000-0000-0000-0000-000000000000', 'I cheated on my midterm', 'And I got away with it.', true, false, false);

-- Comments
insert into public.comments (id, post_id, user_id, content, is_anonymous)
values
  ('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Drink lots of water and take 20 min naps!', false),
  ('c2222222-2222-2222-2222-222222222222', 'b3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Hang in there, man. You are not alone.', true);

-- Reports (including one SELF_HARM_CONCERN)
insert into public.reports (id, target_type, target_id, reporter_id, reason, status)
values
  ('d1111111-1111-1111-1111-111111111111', 'POST', 'b4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Academic Dishonesty', 'PENDING'),
  ('d2222222-2222-2222-2222-222222222222', 'POST', 'b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'SELF_HARM_CONCERN', 'PENDING');

-- Announcements
insert into public.announcements (id, title, content, created_by, is_important)
values
  ('e1111111-1111-1111-1111-111111111111', 'Welcome to Ventiora!', 'We are excited to launch our new community platform.', '33333333-3333-3333-3333-333333333333', true);

-- Tags
insert into public.tags (id, name)
values
  ('f1111111-1111-1111-1111-111111111111', 'internship'),
  ('f2222222-2222-2222-2222-222222222222', 'finals');

insert into public.post_tags (post_id, tag_id)
values
  ('b2222222-2222-2222-2222-222222222222', 'f1111111-1111-1111-1111-111111111111'),
  ('b1111111-1111-1111-1111-111111111111', 'f2222222-2222-2222-2222-222222222222');
