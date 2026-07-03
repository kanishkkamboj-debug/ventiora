/**
 * src/router/ProtectedRoute.tsx
 *
 * Guards routes that require an authenticated session.
 *
 * State machine:
 *   isLoading=true               → full-page loading skeleton (never redirect
 *                                  prematurely — would bounce a logged-in user
 *                                  on every hard refresh)
 *   isLoading=false, user=null   → redirect to /login, preserving the intended
 *                                  destination in location.state.from so LoginPage
 *                                  can return the user here after sign-in
 *   isLoading=false, user exists → render children
 *
 * The guard logic is fully correct today. It will only start actually blocking
 * unauthenticated requests once Prompt 16 wires real Supabase session detection
 * into AuthContext. Until then, AuthContext hard-codes user = mockUsers[0], so
 * every visitor is treated as authenticated — that's intentional and expected
 * during the pre-Prompt-16 development phase.
 *
 * ⚠️  Never wrap /login itself in <ProtectedRoute> — that would create an
 *     infinite redirect loop: unauthenticated → /login → unauthenticated → /login…
 *     See AppRouter.tsx where /login is always a bare public <Route>.
 */

import React from 'react';
import {
  AuthLoadingSkeleton,
  RedirectToLogin,
  useRequireAuth,
} from './routerUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useRequireAuth();

  if (auth.status === 'loading') return <AuthLoadingSkeleton />;
  if (auth.status === 'unauthenticated') return <RedirectToLogin />;

  // Authenticated — render the protected content.
  return <>{children}</>;
}
