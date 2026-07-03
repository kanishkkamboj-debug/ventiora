import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Ventiora end-to-end tests.
 *
 * - baseURL is read from PLAYWRIGHT_BASE_URL env var so CI can override it.
 * - webServer block boots the Vite dev server automatically when running
 *   `npm run test:e2e` locally.
 * - Tests live in the `e2e/` directory.
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',

  /* Fail the suite if any test has an uncaught exception or assertion error */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: BASE_URL,
    /* Capture trace on first retry to make debugging easier in CI */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Boot the Vite dev server automatically during local E2E runs */
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    /* Wait up to 30 s for the dev server to be ready */
    timeout: 30_000,
    /* Reuse an already-running server instead of starting a new one */
    reuseExistingServer: !process.env.CI,
  },
});
