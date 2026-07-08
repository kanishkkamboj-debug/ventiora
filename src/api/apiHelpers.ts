/**
 * src/api/apiHelpers.ts
 *
 * Internal helpers shared by all src/api/*.api.ts modules.
 *
 * Rules:
 *   - Never import from mockData.ts — real Supabase queries only.
 *   - Never log query results (no console.log of data).
 *   - Never expose a service-role key — only the anon key in supabaseClient.
 *   - Always wrap Supabase errors into ApiError before returning.
 */

import type { ApiError, ApiResult } from '../types/common.types';

/** Convert a raw Supabase error object into the canonical ApiError shape. */
export function toApiError(err: {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
} | null | unknown): ApiError {
  if (!err || typeof err !== 'object') {
    return { status: 500, message: 'Unknown error' };
  }
  const e = err as Record<string, unknown>;
  // Map common PostgREST status codes; default to 500.
  const code = String(e['code'] ?? '');
  let status = 500;
  if (code === 'PGRST116') status = 404; // no rows returned
  if (code === '23505') status = 409;    // unique-constraint violation
  if (code === '42501') status = 403;    // insufficient privilege
  return {
    status,
    message: (e['message'] as string | undefined) ?? 'An unexpected error occurred',
  };
}

/** Wrap a successful result into ApiResult<T>. */
export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

/** Wrap a Supabase error into ApiResult<T>. */
export function fail<T>(
  err: { message?: string; code?: string } | null | unknown,
): ApiResult<T> {
  return { ok: false, error: toApiError(err) };
}
