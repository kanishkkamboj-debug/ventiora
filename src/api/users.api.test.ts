/**
 * src/api/users.api.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockQueryBuilder } from '@/test/supabaseMock';

var _builder: MockQueryBuilder;
var _storageBucket: Record<string, ReturnType<typeof vi.fn>>;

vi.mock('@/lib/supabaseClient', () => {
  const mkFn = () => vi.fn();
  _builder = {
    select: mkFn(), insert: mkFn(), update: mkFn(), upsert: mkFn(), delete: mkFn(),
    single: mkFn(), maybeSingle: mkFn(),
    eq: mkFn(), neq: mkFn(), gt: mkFn(), gte: mkFn(), lt: mkFn(), lte: mkFn(),
    like: mkFn(), ilike: mkFn(), in: mkFn(), is: mkFn(), contains: mkFn(),
    order: mkFn(), limit: mkFn(), range: mkFn(), match: mkFn(), filter: mkFn(),
    or: mkFn(), not: mkFn(), returns: mkFn(),
  };
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
  _storageBucket = {
    upload: vi.fn().mockResolvedValue({ data: { path: 'avatars/u1/avatar.jpg' }, error: null }),
    getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.supabase.co/avatar.jpg' } }),
  };
  return {
    supabase: {
      from: vi.fn().mockReturnValue(_builder),
      storage: { from: vi.fn().mockReturnValue(_storageBucket) },
    },
  };
});

import { getUserByUsername, getUserById, updateProfile, getUsers, banUser, unbanUser } from './users.api';

const FAKE = { id: 'u1', username: 'testuser', email: 'test@uni.edu', role: 'STUDENT', is_banned: false, is_suspended: false, avatar_url: null, bio: null, created_at: '2025-01-01' };
const DB_ERR = { message: 'DB error', code: '500' };

beforeEach(() => {
  vi.clearAllMocks();
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
});

describe('getUserByUsername', () => {
  it('returns ok with user on success', async () => {
    _builder.single.mockResolvedValueOnce({ data: FAKE, error: null });
    const r = await getUserByUsername('testuser');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.username).toBe('testuser');
  });

  it('returns fail (404) when user not found', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: null });
    const r = await getUserByUsername('nobody');
    expect(r.ok).toBe(false);
    if (!r.ok) { expect(r.error.status).toBe(404); expect(r.error.message).toBe('User not found'); }
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getUserByUsername('testuser');
    expect(r.ok).toBe(false);
  });
});

describe('getUserById', () => {
  it('returns ok with user on success', async () => {
    _builder.single.mockResolvedValueOnce({ data: FAKE, error: null });
    const r = await getUserById('u1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.id).toBe('u1');
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getUserById('u1');
    expect(r.ok).toBe(false);
  });
});

describe('updateProfile', () => {
  it('returns ok with updated user', async () => {
    _builder.single.mockResolvedValueOnce({ data: { ...FAKE, bio: 'New bio' }, error: null });
    const r = await updateProfile('u1', { bio: 'New bio' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.bio).toBe('New bio');
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await updateProfile('u1', { bio: 'x' });
    expect(r.ok).toBe(false);
  });
});

describe('getUsers', () => {
  it('returns ok with user array', async () => {
    _builder.range.mockResolvedValueOnce({ data: [FAKE], error: null });
    const r = await getUsers();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data[0].id).toBe('u1');
  });

  it('returns fail on Supabase error', async () => {
    _builder.range.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getUsers();
    expect(r.ok).toBe(false);
  });
});

describe('banUser', () => {
  it('returns ok with banned user', async () => {
    _builder.single.mockResolvedValueOnce({ data: { ...FAKE, is_banned: true }, error: null });
    const r = await banUser('u1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.is_banned).toBe(true);
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await banUser('u1');
    expect(r.ok).toBe(false);
  });
});

describe('unbanUser', () => {
  it('returns ok with unbanned user', async () => {
    _builder.single.mockResolvedValueOnce({ data: { ...FAKE, is_banned: false }, error: null });
    const r = await unbanUser('u1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.is_banned).toBe(false);
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await unbanUser('u1');
    expect(r.ok).toBe(false);
  });
});
