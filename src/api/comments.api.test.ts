/**
 * src/api/comments.api.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockQueryBuilder } from '@/test/supabaseMock';

var _builder: MockQueryBuilder;

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
  return { supabase: { from: vi.fn().mockReturnValue(_builder) } };
});

import { getCommentsByPostId, getRepliesByCommentId, createComment, deleteComment } from './comments.api';

const FAKE = { id: 'c1', post_id: 'p1', content: 'Great!', is_anonymous: false, parent_id: null, reply_count: 0, created_at: '2025-01-01T00:00:00Z' };
const DB_ERR = { message: 'DB error', code: '500' };

beforeEach(() => {
  vi.clearAllMocks();
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
});

describe('getCommentsByPostId', () => {
  it('returns ok with comment array', async () => {
    _builder.order.mockResolvedValueOnce({ data: [FAKE], error: null });
    const r = await getCommentsByPostId('p1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual([FAKE]);
  });

  it('returns fail on Supabase error', async () => {
    _builder.order.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getCommentsByPostId('p1');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('DB error');
  });

  it('returns empty array when data is null', async () => {
    _builder.order.mockResolvedValueOnce({ data: null, error: null });
    const r = await getCommentsByPostId('p1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual([]);
  });
});

describe('getRepliesByCommentId', () => {
  it('returns ok with reply array', async () => {
    _builder.order.mockResolvedValueOnce({ data: [{ ...FAKE, id: 'reply-1', parent_id: 'c1' }], error: null });
    const r = await getRepliesByCommentId('c1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data[0].id).toBe('reply-1');
  });

  it('returns fail on Supabase error', async () => {
    _builder.order.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getRepliesByCommentId('c1');
    expect(r.ok).toBe(false);
  });
});

describe('createComment', () => {
  it('returns ok with created comment', async () => {
    _builder.single.mockResolvedValueOnce({ data: FAKE, error: null });
    const r = await createComment({ postId: 'p1', content: 'Great!', isAnonymous: false, authorId: 'u1' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.content).toBe('Great!');
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await createComment({ postId: 'p', content: 'c', isAnonymous: false, authorId: 'u' });
    expect(r.ok).toBe(false);
  });
});

describe('deleteComment', () => {
  it('returns ok null on soft-delete', async () => {
    _builder.eq.mockResolvedValueOnce({ data: null, error: null });
    const r = await deleteComment('c1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBeNull();
  });

  it('returns fail on Supabase error', async () => {
    _builder.eq.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await deleteComment('c1');
    expect(r.ok).toBe(false);
  });
});
