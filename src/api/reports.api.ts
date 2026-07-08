/**
 * src/api/reports.api.ts
 *
 * Data-access functions for the `reports` resource.
 * All queries run against Supabase — never against mockData.ts.
 *
 * Return convention: ApiResult<T> — see src/types/common.types.ts.
 */

import { supabase } from '../lib/supabaseClient';
import { ok, fail } from './apiHelpers';
import type { ApiResult } from '../types/common.types';
import type { Report, CreateReportRequest, ReportStatus } from '../types/report.types';

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

const REPORT_SELECT = `
  id,
  target_type,
  target_id,
  target_preview,
  reason,
  description,
  status,
  created_at,
  resolved_at,
  reporter:profiles!reporter_id(id, username, avatar_url, role),
  resolved_by:profiles!resolved_by_id(id, username, avatar_url, role)
`.trim();

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

/** Submit a new report on a post or comment. */
export async function createReport(
  input: CreateReportRequest,
): Promise<ApiResult<Report>> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        target_type: input.targetType,
        target_id: input.targetId,
        reason: input.reason,
        description: input.description ?? null,
      })
      .select(REPORT_SELECT)
      .single();

    if (error) return fail(error);
    return ok(data as unknown as Report);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Fetch all reports (admin only — enforced by RLS, see Prompt 42).
 * Optionally filter by status.
 */
export async function getReports(
  status?: ReportStatus,
): Promise<ApiResult<Report[]>> {
  try {
    let query = supabase
      .from('reports')
      .select(REPORT_SELECT);

    if (status) {
      query = query.eq('status', status);
    }

    // order is always the terminal awaited call
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return fail(error);
    return ok((data ?? []) as unknown as Report[]);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Resolve a report by accepting or rejecting it.
 * Admin only — enforced by RLS (Prompt 42).
 */
export async function resolveReport(
  reportId: string,
  status: 'ACCEPTED' | 'REJECTED',
): Promise<ApiResult<Report>> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({
        status,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', reportId)
      .select(REPORT_SELECT)
      .single();

    if (error) return fail(error);
    return ok(data as unknown as Report);
  } catch (err) {
    return fail(err);
  }
}
