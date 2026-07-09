import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppRouter } from './router/AppRouter';

// ── All app-level providers live here in one place ────────────────────────────
//
// Current provider tree (innermost → outermost):
//   BrowserRouter → AppRouter
//   ThemeProvider  (single instance; outer wrapper in main.tsx was removed — Prompt 06)
//   AuthProvider   (real Supabase session — Prompt 16)
//   QueryClientProvider (React Query — already wired; Prompt 15 adds RLS-aware defaults)
//
// To add a new provider, wrap it around QueryClientProvider or AuthProvider as
// appropriate for its dependency order.

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* ThemeProvider is the single source of truth — Prompt 06 */}
        <ThemeProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
