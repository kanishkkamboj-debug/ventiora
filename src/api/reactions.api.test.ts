/**
 * src/api/reactions.api.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockQueryBuilder } from '@/test/supabaseMock';

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
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
  _rpc = vi.fn().mockResolvedValue({ data: [], error: null });
  return { supabase: { from: vi.fn().mockReturnValue(_builder), rpc: _rpc } };
});

import { addReaction, removeReaction, getReactionSummary } from './reactions.api';

const DB_ERR = { message: 'DB error', code: '500' };

beforeEach(() => {
  vi.clearAllMocks();
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
  _rpc.mockResolvedValue({ data: [], error: null });
});

describe('addReaction', () => {
  it('returns ok null on successful upsert', async () => {
    _builder.upsert.mockResolvedValueOnce({ data: null, error: null });
    const r = await addReaction({ targetType: 'POST', targetId: 'p1', reactionType: 'LIKE' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBeNull();
  });

  it('returns fail on Supabase error', async () => {
    _builder.upsert.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await addReaction({ targetType: 'POST', targetId: 'p1', reactionType: 'LIKE' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('DB error');
  });
});

describe('removeReaction', () => {
  it('returns ok null on successful delete', async () => {
    _builder.match.mockResolvedValueOnce({ data: null, error: null });
    const r = await removeReaction({ targetType: 'POST', targetId: 'p1' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBeNull();
  });

  it('returns fail on Supabase error', async () => {
    _builder.match.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await removeReaction({ targetType: 'POST', targetId: 'p1' });
    expect(r.ok).toBe(false);
  });
});

describe('getReactionSummary', () => {
  it('returns ok with summary array', async () => {
    const data = [{ targetType: 'POST', targetId: 'p1', reactionType: 'LIKE', count: 5, userReacted: true }];
    _rpc.mockResolvedValueOnce({ data, error: null });
    const r = await getReactionSummary('POST', 'p1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual(data);
  });

  it('returns fail on RPC error', async () => {
    _rpc.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getReactionSummary('POST', 'p1');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('DB error');
  });

  it('returns empty array when no reactions', async () => {
    _rpc.mockResolvedValueOnce({ data: null, error: null });
    const r = await getReactionSummary('POST', 'p1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual([]);
  });
});
