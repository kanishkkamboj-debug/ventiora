/**
 * src/api/notifications.api.test.ts
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

import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from './notifications.api';

const FAKE = { id: 'n1', type: 'COMMENT_ON_POST', message: 'Reply', is_read: false, created_at: '2025-01-01' };
const DB_ERR = { message: 'DB error', code: '500' };

beforeEach(() => {
  vi.clearAllMocks();
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
});

describe('getNotifications', () => {
  it('returns ok with notification array', async () => {
    _builder.order.mockResolvedValueOnce({ data: [FAKE], error: null });
    const r = await getNotifications();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data[0].id).toBe('n1');
  });

  it('returns fail on Supabase error', async () => {
    _builder.order.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getNotifications();
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('DB error');
  });
});

describe('markNotificationRead', () => {
  it('returns ok with updated notification', async () => {
    _builder.single.mockResolvedValueOnce({ data: { ...FAKE, is_read: true }, error: null });
    const r = await markNotificationRead('n1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.is_read).toBe(true);
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await markNotificationRead('n1');
    expect(r.ok).toBe(false);
  });
});

describe('markAllNotificationsRead', () => {
  it('returns ok null on success', async () => {
    _builder.eq.mockResolvedValueOnce({ data: null, error: null });
    const r = await markAllNotificationsRead();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBeNull();
  });

  it('returns fail on Supabase error', async () => {
    _builder.eq.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await markAllNotificationsRead();
    expect(r.ok).toBe(false);
  });
});

describe('deleteNotification', () => {
  it('returns ok null on successful delete', async () => {
    _builder.eq.mockResolvedValueOnce({ data: null, error: null });
    const r = await deleteNotification('n1');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBeNull();
  });

  it('returns fail on Supabase error', async () => {
    _builder.eq.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await deleteNotification('n1');
    expect(r.ok).toBe(false);
  });
});
