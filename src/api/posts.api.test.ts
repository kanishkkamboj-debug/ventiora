/**
 * src/api/posts.api.test.ts
 *
 * Mock pattern: module-level `let` vars assigned inside vi.mock factory (hoisted).
 * The factory runs synchronously before test code — no TDZ issues.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockQueryBuilder } from '@/test/supabaseMock';

// ── The builder and rpc refs are assigned inside the vi.mock factory ──────────
var _builder: MockQueryBuilder;
var _rpc: ReturnType<typeof vi.fn>;

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
  // All methods return builder (chainable); terminals are overridden per-test
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
  _rpc = vi.fn().mockResolvedValue({ data: [], error: null });
  return {
    supabase: {
      from: vi.fn().mockReturnValue(_builder),
      auth: {},
      rpc: _rpc,
    },
  };
});

import { getPosts, getPostById, createPost, updatePost, deletePost } from './posts.api';

const FAKE_POST = { id: 'post-1', title: 'Hello World', content: 'Test', is_anonymous: false, created_at: '2025-01-01T00:00:00Z' };
const DB_ERR = { message: 'DB error', code: '500' };

function rewire() {
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
}

beforeEach(() => { vi.clearAllMocks(); rewire(); });

// getPosts ──────────────────────────────────────────────────────────────────

describe('getPosts', () => {
  it('returns ok with data array on success', async () => {
    _builder.range.mockResolvedValueOnce({ data: [FAKE_POST], error: null });
    const r = await getPosts();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual([FAKE_POST]);
  });

  it('returns fail on Supabase error', async () => {
    _builder.range.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getPosts();
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('DB error');
  });

  it('applies categoryId filter', async () => {
    _builder.range.mockResolvedValueOnce({ data: [], error: null });
    await getPosts({ categoryId: 'cat-1' });
    expect(_builder.eq).toHaveBeenCalledWith('category_id', 'cat-1');
  });

  it('returns empty array when data is null', async () => {
    _builder.range.mockResolvedValueOnce({ data: null, error: null });
    const r = await getPosts();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual([]);
  });
});

// getPostById ───────────────────────────────────────────────────────────────

describe('getPostById', () => {
  it('returns ok with the post on success', async () => {
    _builder.single.mockResolvedValueOnce({ data: FAKE_POST, error: null });
    const r = await getPostById('post-1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual(FAKE_POST);
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getPostById('post-1');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('DB error');
  });

  it('returns fail (404) when data is null, no error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: null });
    const r = await getPostById('missing');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.status).toBe(404);
  });
});

// createPost ────────────────────────────────────────────────────────────────

describe('createPost', () => {
  it('returns ok with created post', async () => {
    _builder.single.mockResolvedValueOnce({ data: FAKE_POST, error: null });
    const r = await createPost({ title: 'Hello World', content: 'C', categoryId: 'c', tagIds: [], isAnonymous: false, authorId: 'u' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.title).toBe('Hello World');
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await createPost({ title: 'T', content: 'C', categoryId: 'c', tagIds: [], isAnonymous: false, authorId: 'u' });
    expect(r.ok).toBe(false);
  });
});

// updatePost ────────────────────────────────────────────────────────────────

describe('updatePost', () => {
  it('returns ok with updated post', async () => {
    _builder.single.mockResolvedValueOnce({ data: { ...FAKE_POST, title: 'Updated' }, error: null });
    const r = await updatePost('post-1', { title: 'Updated' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.title).toBe('Updated');
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await updatePost('post-1', { title: 'X' });
    expect(r.ok).toBe(false);
  });
});

// deletePost ────────────────────────────────────────────────────────────────

describe('deletePost', () => {
  it('returns ok null on soft-delete', async () => {
    _builder.eq.mockResolvedValueOnce({ data: null, error: null });
    const r = await deletePost('post-1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBeNull();
  });

  it('returns fail on Supabase error', async () => {
    _builder.eq.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await deletePost('post-1');
    expect(r.ok).toBe(false);
  });
});
