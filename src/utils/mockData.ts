import type { User } from '../types/user.types';

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
    avatar_url: '',
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
    avatar_url: '',
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
    avatar_url: '',
  }
];

export const mockCategories = [
  { id: 'cat-1', name: 'Studies', emoji: '📚', description: 'Academic discussions and study help', slug: 'studies', postCount: 150, isActive: true },
  { id: 'cat-2', name: 'Placements', emoji: '💼', description: 'Career, internships, and interviews', slug: 'placements', postCount: 200, isActive: true },
  { id: 'cat-3', name: 'Mental Health', emoji: '😔', description: 'Safe space for support', slug: 'mental-health', postCount: 85, isActive: true },
  { id: 'cat-4', name: 'Relationships', emoji: '❤️', description: 'Dating and friendships', slug: 'relationships', postCount: 120, isActive: true },
  { id: 'cat-5', name: 'College Life', emoji: '🏫', description: 'Dorm life and campus events', slug: 'college-life', postCount: 300, isActive: true },
];

export const mockTags = [
  { id: 'tag-1', name: 'Internship', slug: 'internship' },
  { id: 'tag-2', name: 'FAANG', slug: 'faang' },
  { id: 'tag-3', name: 'Exams', slug: 'exams' }
];

import type { Post } from '../types/post.types';
import type { Comment } from '../types/comment.types';
import type { Notification } from '../types/notification.types';

export const mockNotifications: Notification[] = [
  { id: 'notif-1', actorUsername: mockUsers[0].username, type: 'COMMENT_ON_POST', message: 'Someone replied to your post', isRead: false, createdAt: new Date().toISOString(), targetType: 'POST', targetId: 'post-1' },
  { id: 'notif-2', actorUsername: mockUsers[0].username, type: 'REACTION_ON_COMMENT', message: 'Someone reacted to your comment', isRead: true, createdAt: new Date().toISOString(), targetType: 'COMMENT', targetId: 'comment-1' }
];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'How to survive finals week with zero sleep',
    content: 'Just kidding, get some sleep. But really, any tips for staying awake?',
    author: { isAnonymous: false, user: mockUsers[0] },
    category: mockCategories[0],
    tags: [mockTags[2]],
    isAnonymous: false,
    isPinned: true,
    isFeatured: true,
    isLocked: false,
    viewCount: 1400,
    commentCount: 2,
    reactions: [{ type: 'LIKE', count: 12, reacted: false }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-2',
    title: 'FAANG Interview Tips',
    content: 'I just passed my technical screen. Happy to answer questions!',
    author: { isAnonymous: false, user: mockUsers[1] },
    category: mockCategories[1],
    tags: [mockTags[0], mockTags[1]],
    isAnonymous: false,
    isPinned: false,
    isFeatured: true,
    isLocked: false,
    viewCount: 3250,
    commentCount: 1,
    reactions: [{ type: 'LIKE', count: 45, reacted: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-3',
    title: 'Feeling completely burnt out',
    content: 'Is anyone else just tired of everything right now?',
    author: { isAnonymous: true, displayName: 'Anonymous' },
    category: mockCategories[2],
    tags: [],
    isAnonymous: true,
    isPinned: false,
    isFeatured: false,
    isLocked: false,
    viewCount: 850,
    commentCount: 1,
    reactions: [{ type: 'LOVE', count: 5, reacted: false }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    author: { isAnonymous: false, user: mockUsers[1] },
    parentId: undefined,
    content: 'Drink lots of water and take 20 min naps!',
    isAnonymous: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replyCount: 0,
    replies: []
  },
  {
    id: 'comment-2',
    postId: 'post-3',
    author: { isAnonymous: true, displayName: 'Anonymous' },
    parentId: undefined,
    content: 'Hang in there, man. You are not alone.',
    isAnonymous: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replyCount: 0,
    replies: []
  }
];
