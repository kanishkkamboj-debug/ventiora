/**
 * e2e/smoke.spec.ts
 *
 * Playwright smoke test: loads the home page and asserts the app is alive.
 * This is intentionally minimal — it only checks that the page loads without
 * a fatal error and that a recognizable element is present.
 */

import { test, expect } from '@playwright/test';

test.describe('Home page — smoke', () => {
  test('loads without error and has a page title', async ({ page }) => {
    await page.goto('/');

    // Page should not be a blank screen or error page
    await expect(page).toHaveTitle(/ventiora/i);
  });

  test('renders a heading or main landmark on the home route', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to hydrate — at least one heading should exist
    const heading = page.getByRole('heading').first();
    const main = page.getByRole('main').first();

    // Either a heading or a main landmark must be present
    const hasHeading = await heading.count() > 0;
    const hasMain = await main.count() > 0;

    expect(hasHeading || hasMain).toBe(true);
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/');

    // The app should render some navigation — check for a nav landmark
    const nav = page.getByRole('navigation').first();
    await expect(nav).toBeVisible();
  });
});
