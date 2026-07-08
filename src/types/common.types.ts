export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
}

export type TargetType = 'POST' | 'COMMENT';

export type Role = 'STUDENT' | 'ADMIN' | 'MODERATOR';

/**
 * Uniform return type for every function in src/api/*.api.ts.
 *
 * Convention:
 *   - Success  → { ok: true;  data: T }
 *   - Failure  → { ok: false; error: ApiError }
 *
 * Callers pattern-match on `result.ok` rather than try/catch, giving
 * TypeScript full narrowing in both branches.
 *
 * @example
 * const result = await postsApi.getPosts();
 * if (!result.ok) {
 *   showError(result.error.message);
 *   return;
 * }
 * render(result.data);
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

