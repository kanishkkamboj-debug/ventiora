/**
 * src/router/ProtectedRoute.test.tsx
 *
 * Tests for the ProtectedRoute guard component.
 *
 * Covers:
 *   1. isLoading=true  → renders full-page loading skeleton (never redirects)
 *   2. isLoading=false, user=null → redirects to /login, preserves `from` state
 *   3. isLoading=false, user={...} → renders children
 *   4. `from` state is passed correctly when redirecting
 *   5. location.state is never undefined when Navigate fires
 */

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AuthContext } from '@/context/AuthContext';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import type { User } from '@/types/user.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal fake user — only fields ProtectedRoute actually inspects */
const fakeUser: User = {
  id: 'user-001',
  username: 'testuser',
  email: 'test@uni.edu',
  role: 'STUDENT',
  is_banned: false,
  is_suspended: false,
  created_at: '2025-01-01T00:00:00Z',
};

/**
 * Helper login page that exposes location.state.from.pathname as a testid span.
 * Used to assert the `from` state is preserved when ProtectedRoute redirects.
 */
function LoginPageWithState() {
  const location = useLocation();
  return (
    <div data-testid="login-page">
      <span data-testid="from-state">
        {(location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? 'no-from'}
      </span>
    </div>
  );
}

interface MockAuthState {
  user: User | null;
  isLoading: boolean;
}

/**
 * Renders <ProtectedRoute> inside a MemoryRouter with a mocked AuthContext.
 *
 * @param authState     What AuthContext exposes to the component
 * @param initialPath   Starting URL (default: '/protected')
 */
function renderProtectedRoute(
  authState: MockAuthState,
  initialPath = '/protected',
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
          {/* The route being guarded */}
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div data-testid="secret-content">Protected Secret</div>
              </ProtectedRoute>
            }
          />
          {/* Login page — needed so Navigate has somewhere to land */}
          <Route
            path="/login"
            element={<div data-testid="login-page">Login Page</div>}
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProtectedRoute', () => {
  // ── State 1: isLoading=true ───────────────────────────────────────────────

  describe('when the session is still loading (isLoading=true)', () => {
    it('renders a loading skeleton — not the protected children', () => {
      renderProtectedRoute({ user: null, isLoading: true });

      expect(screen.queryByTestId('secret-content')).not.toBeInTheDocument();
    });

    it('does NOT redirect to /login while loading', () => {
      renderProtectedRoute({ user: null, isLoading: true });

      // If a redirect occurred, the login page would render
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('renders a status element for screen readers', () => {
      renderProtectedRoute({ user: null, isLoading: true });

      // role="status" or aria-live="polite" must be present
      const statusEl = screen.queryByRole('status');
      expect(statusEl).toBeInTheDocument();
    });

    it('loading element has an accessible label', () => {
      renderProtectedRoute({ user: null, isLoading: true });

      // The spinner/skeleton container should be labelled
      const statusEl = screen.getByRole('status');
      expect(statusEl).toHaveAttribute('aria-live', 'polite');
    });
  });

  // ── State 2: isLoading=false, user=null ───────────────────────────────────

  describe('when the session resolved with no user (isLoading=false, user=null)', () => {
    it('redirects to /login', () => {
      renderProtectedRoute({ user: null, isLoading: false });

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('does NOT render the protected children', () => {
      renderProtectedRoute({ user: null, isLoading: false });

      expect(screen.queryByTestId('secret-content')).not.toBeInTheDocument();
    });

    it('preserves the original location in navigation state so LoginPage can redirect back', () => {
      // We test the `from` state by rendering a /login component that reads
      // location.state — useLocation is imported statically at the top of the file.
      const mockContextValue = {
        user: null,
        isLoading: false,
        isAuthenticated: false,
        login: async () => {},
        logout: () => {},
      };

      render(
        <AuthContext.Provider value={mockContextValue}>
          <MemoryRouter initialEntries={['/messages']}>
            <Routes>
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <div>Messages</div>
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPageWithState />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      // The from state must carry the original pathname
      expect(screen.getByTestId('from-state').textContent).toBe('/messages');
    });

    it('does not throw when location.state is initially undefined', () => {
      // MemoryRouter with a path that has no prior state — Navigate should
      // still work without throwing.
      expect(() =>
        renderProtectedRoute({ user: null, isLoading: false }, '/protected'),
      ).not.toThrow();
    });
  });

  // ── State 3: isLoading=false, user exists ─────────────────────────────────

  describe('when the session resolved with a valid user (isLoading=false, user=User)', () => {
    it('renders the protected children', () => {
      renderProtectedRoute({ user: fakeUser, isLoading: false });

      expect(screen.getByTestId('secret-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Secret')).toBeInTheDocument();
    });

    it('does NOT render the login page', () => {
      renderProtectedRoute({ user: fakeUser, isLoading: false });

      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('does NOT render the loading skeleton', () => {
      renderProtectedRoute({ user: fakeUser, isLoading: false });

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  // ── Edge cases ─────────────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('renders nothing extra beyond the children when authenticated', () => {
      const { container } = renderProtectedRoute({ user: fakeUser, isLoading: false });

      // The ProtectedRoute itself is a transparent wrapper — no extra DOM nodes
      // other than what MemoryRouter and Routes add.
      expect(screen.getByTestId('secret-content')).toBeInTheDocument();
      // Container should not have a role="status" element when authenticated
      expect(container.querySelector('[role="status"]')).toBeNull();
    });

    it('transitions correctly from loading → authenticated without a flash-to-login', () => {
      // Simulate the real lifecycle: isLoading starts true, then resolves to user=User.
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
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path="/protected"
                element={
                  <ProtectedRoute>
                    <div data-testid="secret-content">Secret</div>
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<div data-testid="login-page" />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      // Phase 1: loading
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByTestId('secret-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();

      // Phase 2: session resolved → user authenticated
      rerender(
        <AuthContext.Provider
          value={{
            user: fakeUser,
            isLoading: false,
            isAuthenticated: true,
            login: async () => {},
            logout: () => {},
          }}
        >
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path="/protected"
                element={
                  <ProtectedRoute>
                    <div data-testid="secret-content">Secret</div>
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<div data-testid="login-page" />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>,
      );

      // Must show content — no /login flash
      expect(screen.getByTestId('secret-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });
  });
});
