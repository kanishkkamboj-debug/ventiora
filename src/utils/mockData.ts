import type { User } from '../types/user.types';
import type { Category } from '../types/common.types';
import type { Post } from '../types/post.types';
import type { Comment } from '../types/comment.types';

export const mockUsers: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    username: 'alex_campus',
    email: 'alex@university.edu',
    bio: 'CS senior. Loves coffee and distributed systems.',
    role: 'STUDENT',
    is_banned: false,
    is_suspended: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    username: 'priya_dev',
    email: 'priya@university.edu',
    bio: 'Design system enthusiast.',
    role: 'STUDENT',
    is_banned: false,
    is_suspended: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    username: 'admin_root',
    email: 'admin@university.edu',
    bio: 'Platform Administrator.',
    role: 'ADMIN',
    is_banned: false,
    is_suspended: false,
    created_at: new Date().toISOString(),
  }
];

export const mockCategories = [
  { id: 'cat-1', name: 'Studies', emoji: '📚', description: 'Academic discussions and study help' },
  { id: 'cat-2', name: 'Placements', emoji: '💼', description: 'Career, internships, and interviews' },
  { id: 'cat-3', name: 'Mental Health', emoji: '😔', description: 'Safe space for support' },
  { id: 'cat-4', name: 'Relationships', emoji: '❤️', description: 'Dating and friendships' },
  { id: 'cat-5', name: 'College Life', emoji: '🏫', description: 'Dorm life and campus events' },
];

export const mockPosts = [
  {
    id: 'post-1',
    user_id: mockUsers[0].id,
    category_id: 'cat-1',
    title: 'How to survive finals week with zero sleep',
    content: 'Just kidding, get some sleep. But really, any tips for staying awake?',
    is_anonymous: false,
    is_pinned: true,
    is_featured: true,
    comments_locked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_username: mockUsers[0].username,
    category_name: 'Studies',
    category_emoji: '📚'
  },
  {
    id: 'post-2',
    user_id: mockUsers[1].id,
    category_id: 'cat-2',
    title: 'FAANG Interview Tips',
    content: 'I just passed my technical screen. Happy to answer questions!',
    is_anonymous: false,
    is_pinned: false,
    is_featured: true,
    comments_locked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_username: mockUsers[1].username,
    category_name: 'Placements',
    category_emoji: '💼'
  },
  {
    id: 'post-3',
    user_id: mockUsers[0].id,
    category_id: 'cat-3',
    title: 'Feeling completely burnt out',
    content: 'Is anyone else just tired of everything right now?',
    is_anonymous: true,
    is_pinned: false,
    is_featured: false,
    comments_locked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_username: null,
    category_name: 'Mental Health',
    category_emoji: '😔'
  }
];

export const mockComments = [
  {
    id: 'comment-1',
    post_id: 'post-1',
    user_id: mockUsers[1].id,
    parent_id: null,
    content: 'Drink lots of water and take 20 min naps!',
    is_anonymous: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_username: mockUsers[1].username
  },
  {
    id: 'comment-2',
    post_id: 'post-3',
    user_id: mockUsers[0].id,
    parent_id: null,
    content: 'Hang in there, man. You are not alone.',
    is_anonymous: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_username: null
  }
];
