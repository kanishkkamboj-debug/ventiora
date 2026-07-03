/**
 * src/router/routerUtils.tsx
 *
 * Shared utilities used by both ProtectedRoute and AdminRoute.
 *
 * Keeping these in one place means:
 *   - The loading skeleton is identical across all guards (no visual
 *     inconsistency between auth-loading and admin-loading screens)
 *   - The redirect logic (preserve `from`, use `replace`) lives in exactly
 *     one place and can't drift between the two guards
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types/user.types';

// ---------------------------------------------------------------------------
// Full-page loading skeleton (shared)
// ---------------------------------------------------------------------------

/**
 * Displayed while the session is being resolved.
 * Has role="status" + aria-live="polite" so screen readers announce it.
 * Skeleton dimensions roughly match a typical page header to avoid a
 * jarring layout shift when real content replaces it.
 */
export function AuthLoadingSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Checking authentication…"
      className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background"
    >
      {/* Spinner */}
      <div
        aria-hidden="true"
        className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin"
      />
      {/* Skeleton placeholder rows */}
      <div className="w-full max-w-2xl px-6 space-y-4" aria-hidden="true">
        <div className="h-6 w-48 rounded-lg bg-surface animate-pulse" />
        <div className="h-4 w-full rounded-lg bg-surface animate-pulse" />
        <div className="h-4 w-3/4 rounded-lg bg-surface animate-pulse" />
      </div>
      {/* Screen-reader-only status text */}
      <span className="sr-only">Verifying your session, please wait…</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// useRequireAuth hook
// ---------------------------------------------------------------------------

export type AuthCheckResult =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; user: User };

/**
 * Returns the current auth state in a discriminated-union form that both
 * route guards can pattern-match against.
 *
 * Keeps loading/redirect logic DRY across ProtectedRoute and AdminRoute.
 */
export function useRequireAuth(): AuthCheckResult {
  const { user, isLoading } = useAuth();

  if (isLoading) return { status: 'loading' };
  if (!user) return { status: 'unauthenticated' };
  return { status: 'authenticated', user };
}

// ---------------------------------------------------------------------------
// Redirect helpers
// ---------------------------------------------------------------------------

/** Redirect to /login, preserving the current path in state.from. */
export function RedirectToLogin() {
  const location = useLocation();
  return <Navigate to="/login" state={{ from: location }} replace />;
}

/** Redirect to / (home). Used when an authenticated user lacks permission. */
export function RedirectToHome() {
  return <Navigate to="/" replace />;
}
