/**
 * src/test/smoke/App.test.tsx
 *
 * Smoke test: verifies that <App /> renders without crashing inside all
 * required providers. This is intentionally minimal — it only asserts that
 * no unhandled exception is thrown during initial mount.
 *
 * Note: At this point in the remediation (Prompt 01), pages still import from
 * mockData.ts. That's correct and expected — data wiring happens in later
 * prompts. The supabase mock is applied here only to silence the env-var
 * warning; it does not need to return real data yet.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import App from '@/App';
import { createMockSupabase } from '../supabaseMock';
import { createTestQueryClient } from '../renderWithProviders';

// Silence the real supabase client from attempting actual network calls.
vi.mock('@/lib/supabaseClient', () => ({
  supabase: createMockSupabase(),
}));

describe('App — smoke test', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  it('renders without crashing', () => {
    // App includes its own ThemeProvider, AuthProvider, QueryClientProvider, and
    // BrowserRouter — no extra wrappers needed here.
    // (The outer ThemeProvider duplication in main.tsx was removed by Prompt 06.)
    expect(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>,
      );
    }).not.toThrow();
  });

  it('renders a heading, main, or navigation landmark on the home route', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );

    // The app should render some recognizable content on the home route.
    // We use a loose check so minor UI changes don't break this smoke test.
    const hasHeading = screen.queryAllByRole('heading').length > 0;
    const hasMain = screen.queryAllByRole('main').length > 0;
    const hasNav = screen.queryAllByRole('navigation').length > 0;

    expect(hasHeading || hasMain || hasNav).toBe(true);
  });
});
