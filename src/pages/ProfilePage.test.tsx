/**
 * src/pages/ProfilePage.test.tsx
 *
 * RTL tests for the refactored ProfilePage (Prompt 07).
 * Still uses mock data — Prompt 26 will add real Supabase wiring.
 *
 * Covers:
 *  - ProfileHeader renders correctly (username, join date, counts)
 *  - "User not found" fallback
 *  - Edit button opens ProfileEditForm (only for own profile)
 *  - Cancel returns to ProfileHeader view
 *  - Tab switching via UserHistoryTabs (ARIA semantics)
 *  - Tab panels show/hide correctly
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { createTestQueryClient } from '@/test/renderWithProviders';
import { ProfilePage } from './ProfilePage';

// Silence real supabase client (AuthProvider calls getSession on mount)
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    channel: vi.fn().mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() }),
  },
}));

// ---------------------------------------------------------------------------
// Helper — renders ProfilePage inside a full provider + route tree
// ---------------------------------------------------------------------------

function renderProfile(username = 'alex_campus') {
  const client = createTestQueryClient();
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={[`/users/${username}`]}>
            <Routes>
              <Route path="/users/:username" element={<ProfilePage />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

// ---------------------------------------------------------------------------
// ProfileHeader rendering
// ---------------------------------------------------------------------------

describe('ProfilePage — ProfileHeader rendering', () => {
  it('renders the username as an h1 heading', () => {
    renderProfile('alex_campus');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('@alex_campus');
  });

  it('renders post count in the header', () => {
    renderProfile('alex_campus');
    expect(screen.getByText(/\d+ posts/)).toBeInTheDocument();
  });

  it('renders comment count in the header', () => {
    renderProfile('alex_campus');
    expect(screen.getByText(/\d+ comments/)).toBeInTheDocument();
  });

  it('renders join date in the header', () => {
    renderProfile('alex_campus');
    expect(screen.getByText(/Joined/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// User not found
// ---------------------------------------------------------------------------

describe('ProfilePage — unknown user', () => {
  it('renders "User not found" when username does not exist in mock data', () => {
    renderProfile('nobody_here_9999');
    expect(screen.getByText(/User not found/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Edit profile flow (own profile only)
// ---------------------------------------------------------------------------

describe('ProfilePage — edit profile flow', () => {
  it('shows "Edit Profile" button on own profile (alex_campus)', () => {
    renderProfile('alex_campus');
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
  });

  it('opens ProfileEditForm when Edit Profile is clicked', async () => {
    const user = userEvent.setup();
    renderProfile('alex_campus');
    await user.click(screen.getByRole('button', { name: /edit profile/i }));
    // ProfileEditForm renders an h2 "Edit Profile"
    expect(screen.getByRole('heading', { name: /edit profile/i })).toBeInTheDocument();
    // The h1 (@username) from ProfileHeader should be gone
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('returns to ProfileHeader view when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderProfile('alex_campus');
    await user.click(screen.getByRole('button', { name: /edit profile/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('@alex_campus');
  });
});

// ---------------------------------------------------------------------------
// UserHistoryTabs — ARIA semantics
// ---------------------------------------------------------------------------

describe('ProfilePage — UserHistoryTabs ARIA semantics', () => {
  it('renders a tablist with Posts and Comments tabs', () => {
    renderProfile('alex_campus');
    const tablist = screen.getByRole('tablist');
    const tabs = within(tablist).getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveTextContent(/Posts/);
    expect(tabs[1]).toHaveTextContent(/Comments/);
  });

  it('Posts tab is selected by default (aria-selected="true")', () => {
    renderProfile('alex_campus');
    const postsTab = screen.getByRole('tab', { name: /Posts/i });
    expect(postsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('Comments tab is not selected by default (aria-selected="false")', () => {
    renderProfile('alex_campus');
    const commentsTab = screen.getByRole('tab', { name: /Comments/i });
    expect(commentsTab).toHaveAttribute('aria-selected', 'false');
  });
});

// ---------------------------------------------------------------------------
// UserHistoryTabs — tab switching
// ---------------------------------------------------------------------------

describe('ProfilePage — tab switching', () => {
  it('switches aria-selected when Comments tab is clicked', async () => {
    const user = userEvent.setup();
    renderProfile('alex_campus');
    const commentsTab = screen.getByRole('tab', { name: /Comments/i });
    await user.click(commentsTab);
    expect(commentsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /Posts/i })).toHaveAttribute('aria-selected', 'false');
  });

  it('posts tabpanel is visible by default (not hidden)', () => {
    renderProfile('alex_campus');
    const postsPanel = screen.getByRole('tabpanel', { name: /Posts/i });
    expect(postsPanel).not.toHaveAttribute('hidden');
  });

  it('posts tabpanel becomes hidden after switching to Comments', async () => {
    const user = userEvent.setup();
    renderProfile('alex_campus');
    await user.click(screen.getByRole('tab', { name: /Comments/i }));
    // getByRole skips elements with [hidden]; use getElementById to find it regardless
    const postsPanel = document.getElementById('tabpanel-posts');
    expect(postsPanel).toHaveAttribute('hidden');
  });

  it('comments tabpanel is visible after switching to Comments', async () => {
    const user = userEvent.setup();
    renderProfile('alex_campus');
    await user.click(screen.getByRole('tab', { name: /Comments/i }));
    const commentsPanel = screen.getByRole('tabpanel', { name: /Comments/i });
    expect(commentsPanel).not.toHaveAttribute('hidden');
  });
});
