# Ventiora — Testing Guide

This document explains how to run every test in this repository and how to write new tests against the shared testing infrastructure.

---

## Quick Start

| Command | What it does |
|---|---|
| `npm run test` | Vitest in **watch mode** (interactive, re-runs on file change) |
| `npm run test:run` | Vitest **CI mode** — single pass, exits with code 0 or 1 |
| `npm run test:coverage` | Vitest CI mode + V8 coverage report |
| `npm run test:e2e` | Playwright end-to-end tests (boots the dev server automatically) |

> **Note (Windows):** If your project path contains spaces, `npm run test:*` must be run from the project directory via a terminal session opened in that folder, or from within an IDE that sets the CWD correctly. The scripts themselves work fine once CWD is correct.

---

## Unit / Component Tests (Vitest + React Testing Library)

### Framework
- **Vitest** v4 — test runner, configured in `vite.config.ts` under the `test` key
- **React Testing Library** — renders components, queries the DOM
- **`@testing-library/jest-dom`** — custom matchers like `toBeInTheDocument()`
- **`@testing-library/user-event`** — simulates realistic user interactions

### Where to put test files
Place test files **next to the code they test** using the `.test.tsx` or `.test.ts` suffix:

```
src/
  components/
    widgets/
      PostCard.tsx
      PostCard.test.tsx   ← here
  api/
    posts.api.ts
    posts.api.test.ts     ← here
```

Tests in `src/test/` are infrastructure only (setup, mocks, helpers).

### Setup file
`src/test/setup.ts` runs before every test file. It:
- Imports `@testing-library/jest-dom` (activates all custom matchers)
- Mocks `window.matchMedia` (required by `ThemeContext`)
- Mocks `localStorage` with a clean, isolated store per test
- Stubs Supabase env vars so the client doesn't emit console errors
- Calls `vi.clearAllMocks()` and clears localStorage `afterEach` test

You never need to import this file in your test — it runs automatically.

---

## Shared Test Helpers

### `src/test/renderWithProviders.tsx`

Wraps a component in all app providers so you don't boilerplate the full tree:

```tsx
import { renderWithProviders } from '@/test/renderWithProviders';

it('renders the post title', () => {
  const { getByText } = renderWithProviders(<PostCard post={fakePost} />);
  expect(getByText('My Test Post')).toBeInTheDocument();
});
```

Options:

| Option | Type | Default | Description |
|---|---|---|---|
| `initialPath` | `string` | `'/'` | Starting URL for `MemoryRouter` |
| `queryClient` | `QueryClient` | fresh per call | Pre-configured TanStack QueryClient |

Also exports `createTestQueryClient()` for when you need a configured client directly.

The helper also re-exports everything from `@testing-library/react`, so you only need one import:

```tsx
import { renderWithProviders, screen, fireEvent, waitFor } from '@/test/renderWithProviders';
```

---

### `src/test/supabaseMock.ts`

A factory that returns a typed mock of the Supabase client. Every subsequent prompt's tests use this — **never write your own ad-hoc mock**.

#### Basic usage

```tsx
import { createMockSupabase } from '@/test/supabaseMock';
import { vi } from 'vitest';

// At the top of the test file (before any describe/it):
vi.mock('@/lib/supabaseClient', () => ({
  supabase: createMockSupabase(),
}));
```

#### Overriding return values per test

```tsx
const mockSupabase = createMockSupabase();
vi.mock('@/lib/supabaseClient', () => ({ supabase: mockSupabase }));

it('shows posts from the database', async () => {
  // Override what .from('posts').select() resolves with for this test only:
  mockSupabase.from('posts').select.mockResolvedValueOnce({
    data: [{ id: '1', title: 'Hello World', content: 'Body' }],
    error: null,
  });

  const { findByText } = renderWithProviders(<HomePage />);
  await expect(findByText('Hello World')).resolves.toBeInTheDocument();
});
```

#### Simulating a Supabase error

```tsx
mockSupabase.from('posts').select.mockResolvedValueOnce({
  data: null,
  error: { message: 'Network error', code: '503' },
});
```

#### Auth mocks

```tsx
mockSupabase.auth.getSession.mockResolvedValueOnce({
  data: { session: { user: { id: 'user-123', email: 'test@uni.edu' } } },
  error: null,
});
```

#### Default behavior

All methods default to `{ data: null, error: null }` (or `{ data: [], error: null }` for `select`). Tests that don't care about return values need zero setup.

---

## End-to-End Tests (Playwright)

### Configuration
`playwright.config.ts` in the project root:
- `testDir: './e2e'` — all E2E tests live under `e2e/`
- `baseURL` — read from `PLAYWRIGHT_BASE_URL` env var (default `http://localhost:5173`)
- `webServer` — automatically boots `npm run dev` before the tests run (local only; in CI, set `PLAYWRIGHT_BASE_URL` to the deployed URL)

### Running locally

```bash
npm run test:e2e
```

The dev server starts automatically. If it's already running, Playwright reuses it.

### Running in CI

```bash
PLAYWRIGHT_BASE_URL=https://staging.ventiora.app npm run test:e2e
```

Or set `CI=true` to disable the `webServer` block and point at an existing URL.

### Writing E2E tests

```ts
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('student@uni.edu');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL('/');
});
```

### Trace & artifacts

On failure, Playwright saves:
- Screenshot (`screenshot: 'only-on-failure'`)
- Video (`video: 'retain-on-failure'`)
- Trace (`trace: 'on-first-retry'`)

Open a trace: `npx playwright show-trace trace.zip`

---

## Coverage

```bash
npm run test:coverage
```

Generates three reports in `coverage/`:
- `text` — printed to terminal
- `json` — for CI badge / external tools
- `html` — open `coverage/index.html` in a browser for line-level detail

Coverage excludes: `src/test/`, `*.config.*`, `*.d.ts`, `src/main.tsx`.

---

## CI Setup

Add to your CI pipeline:

```yaml
# GitHub Actions example
- name: Run unit tests
  run: npm run test:run

- name: Run coverage
  run: npm run test:coverage

- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm run test:e2e
  env:
    PLAYWRIGHT_BASE_URL: http://localhost:5173
    CI: true
```

---

## Conventions

1. **No shared mutable state between tests.** Use `beforeEach` to reset state, not module-level variables that mutate.
2. **No order dependency.** Each test file must be runnable in isolation.
3. **No real network calls.** Mock Supabase via `createMockSupabase()`. Never call `supabase.from(...)` directly in test code.
4. **Prefer `findBy*` over `getBy*` for async content** — `findBy*` waits; `getBy*` throws immediately.
5. **Use `userEvent` over `fireEvent`** for user interactions — it simulates real events (pointer, keyboard).

```tsx
import userEvent from '@testing-library/user-event';

it('submits the form', async () => {
  const user = userEvent.setup();
  const { getByRole } = renderWithProviders(<LoginPage />);
  await user.type(getByRole('textbox', { name: /email/i }), 'a@b.com');
  await user.click(getByRole('button', { name: /sign in/i }));
  // ...
});
```
