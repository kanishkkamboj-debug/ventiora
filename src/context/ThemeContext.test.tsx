/**
 * src/context/ThemeContext.test.tsx
 *
 * Regression proof for Prompt 06 (ThemeProvider de-duplication).
 *
 * Verifies that with a SINGLE ThemeProvider instance:
 *   1. Default state is read from localStorage (or system preference).
 *   2. toggleMode() adds/removes the `dark` class on document.documentElement.
 *   3. setMode() writes the correct value to localStorage.
 *   4. setTheme() sets data-theme on document.documentElement.
 *   5. setTheme() writes the value to localStorage.
 *   6. useTheme() throws when called outside a ThemeProvider.
 *
 * These tests are the "before/after" proof that collapsing to one provider
 * changed nothing about observable behaviour.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from '../hooks/useTheme';

// ---------------------------------------------------------------------------
// Helper: render a component that exposes the full theme context via buttons
// ---------------------------------------------------------------------------

function ThemeTestHarness() {
  const { theme, mode, toggleMode, setTheme, setMode } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleMode}>toggle-mode</button>
      <button onClick={() => setMode('dark')}>set-dark</button>
      <button onClick={() => setMode('light')}>set-light</button>
      <button onClick={() => setTheme('theme-1')}>set-theme-1</button>
      <button onClick={() => setTheme('theme-3')}>set-theme-3</button>
    </div>
  );
}

function renderHarness() {
  return render(
    <ThemeProvider>
      <ThemeTestHarness />
    </ThemeProvider>,
  );
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Clear persisted state so each test starts with provider defaults
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  document.documentElement.removeAttribute('data-theme');
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  document.documentElement.removeAttribute('data-theme');
});

// ---------------------------------------------------------------------------
// 1. Default state
// ---------------------------------------------------------------------------

describe('ThemeProvider — default state', () => {
  it('defaults to theme-2 when no localStorage value exists', () => {
    renderHarness();
    expect(screen.getByTestId('theme').textContent).toBe('theme-2');
  });

  it('defaults to light mode when system prefers light (matchMedia mock returns false)', () => {
    // setup.ts mocks matchMedia to return false for prefers-color-scheme: dark
    renderHarness();
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('restores persisted theme from localStorage', () => {
    localStorage.setItem('v-theme', 'theme-4');
    renderHarness();
    expect(screen.getByTestId('theme').textContent).toBe('theme-4');
  });

  it('restores persisted mode from localStorage', () => {
    localStorage.setItem('v-mode', 'dark');
    renderHarness();
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });
});

// ---------------------------------------------------------------------------
// 2. Dark-mode class toggling on document.documentElement
// ---------------------------------------------------------------------------

describe('ThemeProvider — dark mode class on <html>', () => {
  it('adds "dark" class to document.documentElement when mode becomes dark', async () => {
    const user = userEvent.setup();
    renderHarness();
    // Start in light; toggle to dark
    await user.click(screen.getByText('toggle-mode'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes "dark" class from document.documentElement when mode becomes light', async () => {
    const user = userEvent.setup();
    localStorage.setItem('v-mode', 'dark');
    renderHarness();
    // Start in dark; toggle to light
    await user.click(screen.getByText('toggle-mode'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('setMode("dark") adds dark class directly', async () => {
    const user = userEvent.setup();
    renderHarness();
    await user.click(screen.getByText('set-dark'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('setMode("light") removes dark class directly', async () => {
    const user = userEvent.setup();
    localStorage.setItem('v-mode', 'dark');
    renderHarness();
    await user.click(screen.getByText('set-light'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 3. localStorage writes for mode
// ---------------------------------------------------------------------------

describe('ThemeProvider — localStorage persistence (mode)', () => {
  it('writes v-mode to localStorage when mode changes', async () => {
    const user = userEvent.setup();
    renderHarness();
    await user.click(screen.getByText('set-dark'));
    expect(localStorage.getItem('v-mode')).toBe('dark');
  });

  it('writes v-mode = light when toggled back', async () => {
    const user = userEvent.setup();
    localStorage.setItem('v-mode', 'dark');
    renderHarness();
    await user.click(screen.getByText('toggle-mode'));
    expect(localStorage.getItem('v-mode')).toBe('light');
  });
});

// ---------------------------------------------------------------------------
// 4. data-theme attribute on document.documentElement
// ---------------------------------------------------------------------------

describe('ThemeProvider — data-theme attribute on <html>', () => {
  it('sets data-theme attribute on mount from localStorage', () => {
    localStorage.setItem('v-theme', 'theme-3');
    renderHarness();
    expect(document.documentElement.getAttribute('data-theme')).toBe('theme-3');
  });

  it('updates data-theme attribute when setTheme is called', async () => {
    const user = userEvent.setup();
    renderHarness();
    await user.click(screen.getByText('set-theme-1'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('theme-1');
  });
});

// ---------------------------------------------------------------------------
// 5. localStorage writes for theme
// ---------------------------------------------------------------------------

describe('ThemeProvider — localStorage persistence (theme)', () => {
  it('writes v-theme to localStorage when theme changes', async () => {
    const user = userEvent.setup();
    renderHarness();
    await user.click(screen.getByText('set-theme-3'));
    expect(localStorage.getItem('v-theme')).toBe('theme-3');
  });
});

// ---------------------------------------------------------------------------
// 6. useTheme guard
// ---------------------------------------------------------------------------

describe('useTheme — provider guard', () => {
  it('throws when used outside a ThemeProvider', () => {
    // Suppress React's error boundary console output during this expected throw
    const consoleError = console.error;
    console.error = () => {};
    expect(() => render(<ThemeTestHarness />)).toThrow(
      'useTheme must be used within a ThemeProvider',
    );
    console.error = consoleError;
  });
});
