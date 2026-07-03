/**
 * src/router/AdminRoute.tsx
 *
 * Guards routes that require an authenticated ADMIN session.
 *
 * Layered state machine (two levels of checking):
 *
 *   Layer 1 — Auth check (delegated to ProtectedRoute / useRequireAuth):
 *     isLoading=true               → full-page loading skeleton
 *     isLoading=false, user=null   → redirect to /login (with from state)
 *
 *   Layer 2 — Role check (only reached when user is confirmed):
 *     user.role !== 'ADMIN'        → redirect to / (home)
 *                                    (do NOT redirect to /login — user IS logged
 *                                     in, that would be confusing and incorrect)
 *     user.role === 'ADMIN'        → render <AdminLayout>{children}</AdminLayout>
 *
 * Defensive rule: if user.role is undefined, null, or any unexpected value,
 * treat it as non-admin — fail closed, never fail open.
 *
 * ⚠️  CLIENT-SIDE GATE ONLY — this is a UX guard, not a security boundary.
 *     Every admin Supabase write MUST ALSO be protected server-side by an RLS
 *     policy or an `is_admin(auth.uid())` check. Cross-reference Prompt 42
 *     which adds those RLS policies. A client gate without server-side RLS
 *     is theatre — the real protection must be in the database.
 *
 * // TODO (future): Moderator scoping.
 *   The `Role` enum includes 'MODERATOR' but no audit source specifies what
 *   a moderator should be allowed to access (e.g., /admin/reports only?).
 *   Until that decision is made explicitly and tested, MODERATOR is NOT granted
 *   access here. Do not add it silently — it requires its own spec and tests.
 */

import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import {
  AuthLoadingSkeleton,
  RedirectToLogin,
  RedirectToHome,
  useRequireAuth,
} from './routerUtils';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const auth = useRequireAuth();

  // ── Layer 1: Auth check ──────────────────────────────────────────────────

  // Session still resolving — never flash admin content.
  if (auth.status === 'loading') return <AuthLoadingSkeleton />;

  // No session — go to login (preserves intended destination in state.from).
  if (auth.status === 'unauthenticated') return <RedirectToLogin />;

  // ── Layer 2: Role check ──────────────────────────────────────────────────

  const { user } = auth;

  // Defensive: treat any role value that isn't the literal string 'ADMIN'
  // as non-admin — including undefined, null, 'MODERATOR', 'STUDENT', etc.
  // Fail closed: unauthorised access to admin routes is far worse than an
  // admin being unexpectedly blocked and having to re-authenticate.
  if (user.role !== 'ADMIN') {
    return <RedirectToHome />;
  }

  // ── Authenticated ADMIN — render admin shell ──────────────────────────────

  return <AdminLayout>{children}</AdminLayout>;
}
