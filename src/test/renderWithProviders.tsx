/**
 * src/test/renderWithProviders.tsx
 *
 * Wraps a component in all app-level providers so component tests don't need
 * to boilerplate the full provider tree.
 *
 * Usage:
 *   import { renderWithProviders } from '@/test/renderWithProviders';
 *   const { getByText } = renderWithProviders(<MyComponent />);
 *
 * Override options:
 *   renderWithProviders(<MyComponent />, {
 *     initialPath: '/posts/123',        // default: '/'
 *     queryClient: myCustomQueryClient, // default: fresh client per call
 *   });
 */

import React from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Starting URL for MemoryRouter. Defaults to '/'. */
  initialPath?: string;
  /** Pre-configured QueryClient. Defaults to a silent, no-retry client. */
  queryClient?: QueryClient;
}

// ---------------------------------------------------------------------------
// Default QueryClient for tests
// ---------------------------------------------------------------------------

/**
 * Creates a QueryClient configured for tests:
 * - no retries (so errors surface immediately)
 * - no garbage collection delay (so we don't need to clean up)
 * - logger silenced (avoids noisy console output in test runs)
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Main render helper
// ---------------------------------------------------------------------------

export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialPath = '/',
    queryClient,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
): RenderResult {
  const client = queryClient ?? createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <AuthProvider>
          <ThemeProvider>
            <MemoryRouter initialEntries={[initialPath]}>
              {children}
            </MemoryRouter>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// ---------------------------------------------------------------------------
// Re-export everything from @testing-library/react for convenience
// ---------------------------------------------------------------------------
export * from '@testing-library/react';
export { renderWithProviders as render };
