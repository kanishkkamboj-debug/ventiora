/**
 * src/api/reports.api.test.ts
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

import { createReport, getReports, resolveReport } from './reports.api';

const FAKE = { id: 'report-1', target_type: 'POST', target_id: 'post-1', reason: 'SPAM', status: 'PENDING', created_at: '2025-01-01T00:00:00Z' };
const DB_ERR = { message: 'DB error', code: '500' };

beforeEach(() => {
  vi.clearAllMocks();
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
});

describe('createReport', () => {
  it('returns ok with the created report', async () => {
    _builder.single.mockResolvedValueOnce({ data: FAKE, error: null });
    const r = await createReport({ targetType: 'POST', targetId: 'post-1', reason: 'SPAM' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.reason).toBe('SPAM');
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await createReport({ targetType: 'POST', targetId: 'p', reason: 'SPAM' });
    expect(r.ok).toBe(false);
  });
});

describe('getReports', () => {
  it('returns ok with report array', async () => {
    _builder.order.mockResolvedValueOnce({ data: [FAKE], error: null });
    const r = await getReports();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data[0].id).toBe('report-1');
  });

  it('applies status filter when provided', async () => {
    _builder.order.mockResolvedValueOnce({ data: [], error: null });
    await getReports('PENDING');
    expect(_builder.eq).toHaveBeenCalledWith('status', 'PENDING');
  });

  it('returns fail on Supabase error', async () => {
    _builder.order.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await getReports();
    expect(r.ok).toBe(false);
  });
});

describe('resolveReport', () => {
  it('returns ok with the resolved report', async () => {
    _builder.single.mockResolvedValueOnce({ data: { ...FAKE, status: 'ACCEPTED' }, error: null });
    const r = await resolveReport('report-1', 'ACCEPTED');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.status).toBe('ACCEPTED');
  });

  it('returns fail on Supabase error', async () => {
    _builder.single.mockResolvedValueOnce({ data: null, error: DB_ERR });
    const r = await resolveReport('report-1', 'REJECTED');
    expect(r.ok).toBe(false);
  });
});
