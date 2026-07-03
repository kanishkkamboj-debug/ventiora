/**
 * src/router/AdminRoute.test.tsx
 *
 * Tests for the AdminRoute guard component.
 *
 * Covers all four states:
 *   1. isLoading=true                    → loading skeleton (no admin content)
 *   2. isLoading=false, user=null        → redirect to /login (with from state)
 *   3. isLoading=false, user role=STUDENT → redirect to / (home), not /login
 *   4. isLoading=false, user role=ADMIN  → renders AdminLayout + children
 *
 * Plus defensive/edge cases:
 *   5. role=MODERATOR is treated as non-admin (fail closed)
 *   6. role=undefined is treated as non-admin (fail closed)
 *   7. AdminLayout is NEVER rendered for non-admin users
 */

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthContext } from '@/context/AuthContext';
import { AdminRoute } from '@/router/AdminRoute';
import type { User } from '@/types/user.types';
import type { Role } from '@/types/common.types';

// ---------------------------------------------------------------------------
// Mock AdminLayout — prevents rendering the full admin shell (sidebar, topbar)
// in unit tests. We only care that children appear inside it when role=ADMIN.
// ---------------------------------------------------------------------------
vi.mock('@/components/layout/AdminLayout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  ),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeUser(role: Role | undefined): User {
  return {
    id: 'user-001',
    username: 'testuser',
    email: 'test@uni.edu',
    role: role as Role, // cast covers the undefined case for the defensive test
    is_banned: false,
    is_suspended: false,
    created_at: '2025-01-01T00:00:00Z',
  };
}

/** Helper: reads location.state.from.pathname so we can assert redirect state. */
function LoginPageWithState() {
  const location = useLocation();
  return (
    <div data-testid="login-page">
      <span data-testid="from-state">
        {(location.state as { from?: { pathname?: string } } | null)
          ?.from?.pathname ?? 'no-from'}
      </span>
    </div>
  );
}

interface MockAuthState {
  user: User | null;
  isLoading: boolean;
}

/**
 * Renders <AdminRoute> inside a MemoryRouter with a mocked AuthContext.
 */
function renderAdminRoute(
  authState: MockAuthState,
  initialPath = '/admin',
) {
  const mockContextValue = {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.user !== null,
    login: async () => {},
    logout: () => {},
  };

  return render(
    <AuthContext.Provider value={mockContextValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div data-testid="admin-content">Admin Dashboard</div>
              </AdminRoute>
            }
          />
          {/* Login page — Navigate needs somewhere to land */}
          <Route path="/login" element={<LoginPageWithState />} />
          {/* Home page — RedirectToHome sends non-admins here */}
          <Route
            path="/"
            element={<div data-testid="home-page">Home</div>}
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AdminRoute', () => {
  // ── State 1: isLoading=true ───────────────────────────────────────────────

  describe('when the session is still loading (isLoading=true)', () => {
    it('renders the loading skeleton', () => {
      renderAdminRoute({ user: null, isLoading: true });

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('does NOT render admin content while loading', () => {
      renderAdminRoute({ user: null, isLoading: true });

      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
    });

    it('does NOT redirect to /login or / while loading', () => {
      renderAdminRoute({ user: null, isLoading: true });

      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    });
  });

  // ── State 2: isLoading=false, user=null ───────────────────────────────────

  describe('when unauthenticated (isLoading=false, user=null)', () => {
    it('redirects to /login', () => {
      renderAdminRoute({ user: null, isLoading: false });

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('preserves the admin path in state.from so LoginPage can redirect back', () => {
      renderAdminRoute({ user: null, isLoading: false }, '/admin');

      expect(screen.getByTestId('from-state').textContent).toBe('/admin');
    });

    it('does NOT render admin content or the admin layout', () => {
      renderAdminRoute({ user: null, isLoading: false });

      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
    });

    it('does NOT redirect to home (wrong destination for unauthenticated users)', () => {
      renderAdminRoute({ user: null, isLoading: false });

      // Should be at /login, not /
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    });
  });

  // ── State 3: authenticated, role=STUDENT ─────────────────────────────────

  describe('when authenticated as a non-admin (role=STUDENT)', () => {
    it('redirects to home (/), not to /login', () => {
      renderAdminRoute({ user: makeUser('STUDENT'), isLoading: false });

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('does NOT render admin content', () => {
      renderAdminRoute({ user: makeUser('STUDENT'), isLoading: false });

      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });

    it('does NOT render the AdminLayout (no flash of admin shell)', () => {
      renderAdminRoute({ user: makeUser('STUDENT'), isLoading: false });

      expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
    });
  });

  // ── State 4: authenticated, role=ADMIN ───────────────────────────────────

  describe('when authenticated as ADMIN (role=ADMIN)', () => {
    it('renders the admin content', () => {
      renderAdminRoute({ user: makeUser('ADMIN'), isLoading: false });

      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('wraps children in AdminLayout', () => {
      renderAdminRoute({ user: makeUser('ADMIN'), isLoading: false });

      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    });

    it('does NOT redirect anywhere', () => {
      renderAdminRoute({ user: makeUser('ADMIN'), isLoading: false });

      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    });

    it('does NOT render the loading skeleton', () => {
      renderAdminRoute({ user: makeUser('ADMIN'), isLoading: false });

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  // ── Defensive / fail-closed ───────────────────────────────────────────────

  describe('fail-closed defensive cases', () => {
    it('treats MODERATOR as non-admin — redirects to home (explicit TODO: moderator scope)', () => {
      // MODERATOR access is an explicit open decision — see AdminRoute.tsx TODO.
      // Until scoped permissions are defined and tested, MODERATOR must NOT
      // silently gain admin access.
      renderAdminRoute({ user: makeUser('MODERATOR'), isLoading: false });

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });

    it('treats undefined role as non-admin (fail closed)', () => {
      // Defensive: a malformed session where role is missing must never grant
      // admin access. Fail closed is always safer than fail open.
      renderAdminRoute({
        user: makeUser(undefined as unknown as Role),
        isLoading: false,
      });

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });

    it('AdminLayout is never rendered for any non-ADMIN role', () => {
      const nonAdminRoles: Array<Role | undefined> = ['STUDENT', 'MODERATOR', undefined];

      for (const role of nonAdminRoles) {
        const { unmount } = renderAdminRoute({
          user: makeUser(role as Role),
          isLoading: false,
        });

        expect(screen.queryByTestId('admin-layout')).not.toBeInTheDocument();
        unmount();
      }
    });
  });

  // ── Loading → Admin transition ────────────────────────────────────────────

  describe('loading → admin transition', () => {
    it('shows skeleton while loading then admin content when ADMIN session resolves', () => {
      const { rerender } = render(
        <AuthContext.Provider
          value={{
            user: null,
            isLoading: true,
            isAuthenticated: false,
            login: async () => {},
            logout: () => {},
          }}
        >
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <div data-testid="admin-content">Admin Dashboard</div>
                  </AdminRoute>
                }
              />
              <Route path="/login" element={<div data-testid="login-page" />} />
              <Route path="/" element={<div data-testid="home-page" />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      // Phase 1: loading
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();

      // Phase 2: session resolves as ADMIN
      rerender(
        <AuthContext.Provider
          value={{
            user: makeUser('ADMIN'),
            isLoading: false,
            isAuthenticated: true,
            login: async () => {},
            logout: () => {},
          }}
        >
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <div data-testid="admin-content">Admin Dashboard</div>
                  </AdminRoute>
                }
              />
              <Route path="/login" element={<div data-testid="login-page" />} />
              <Route path="/" element={<div data-testid="home-page" />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('shows skeleton while loading then redirects home when session resolves as STUDENT', () => {
      const { rerender } = render(
        <AuthContext.Provider
          value={{
            user: null,
            isLoading: true,
            isAuthenticated: false,
            login: async () => {},
            logout: () => {},
          }}
        >
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <div data-testid="admin-content">Admin Dashboard</div>
                  </AdminRoute>
                }
              />
              <Route path="/login" element={<div data-testid="login-page" />} />
              <Route path="/" element={<div data-testid="home-page" />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      // Phase 1: loading — no admin content, no redirect
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();

      // Phase 2: resolves as non-admin → redirect to home, NOT /login
      rerender(
        <AuthContext.Provider
          value={{
            user: makeUser('STUDENT'),
            isLoading: false,
            isAuthenticated: true,
            login: async () => {},
            logout: () => {},
          }}
        >
          <MemoryRouter initialEntries={['/admin']}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <div data-testid="admin-content">Admin Dashboard</div>
                  </AdminRoute>
                }
              />
              <Route path="/login" element={<div data-testid="login-page" />} />
              <Route path="/" element={<div data-testid="home-page" />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
      // Must NOT redirect to /login — user IS logged in
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });
  });
});
