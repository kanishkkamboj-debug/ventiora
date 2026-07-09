/**
 * src/components/ui/Avatar.test.tsx
 *
 * Tests for the Avatar component covering:
 *   - Existing behaviour (no regression for current callers)
 *   - New showUsername prop
 *   - New clickable prop
 *   - Anonymous branch
 *   - Fallback when avatarUrl is missing
 *   - Accessibility (alt text, aria-label on Link)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Avatar } from './Avatar';

// Helper: Avatar needs a Router context when clickable=true (for <Link>)
function renderAvatar(props: Parameters<typeof Avatar>[0]) {
  return render(
    <MemoryRouter>
      <Avatar {...props} />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Existing behaviour — no regression
// ---------------------------------------------------------------------------

describe('Avatar — existing behaviour', () => {
  it('renders an <img> with correct src and alt when avatarUrl and username are provided', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', username: 'alice' });
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://cdn.test/pic.jpg');
    expect(img).toHaveAttribute('alt', "alice's avatar");
  });

  it('falls back to the silhouette SVG when avatarUrl is missing', () => {
    renderAvatar({ username: 'alice' });
    expect(screen.queryByRole('img')).toBeNull();
    // The silhouette renders a div + svg (aria-hidden), not an <img>
  });

  it('renders the silhouette (not an img) when isAnonymous is true', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', isAnonymous: true });
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('uses "User avatar" as fallback alt when username is omitted', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg' });
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'User avatar');
  });

  it('does NOT render a username label by default (showUsername defaults to false)', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', username: 'alice' });
    expect(screen.queryByText('alice')).toBeNull();
  });

  it('does NOT wrap in a Link by default (clickable defaults to false)', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', username: 'alice' });
    expect(screen.queryByRole('link')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// showUsername prop
// ---------------------------------------------------------------------------

describe('Avatar — showUsername prop', () => {
  it('renders the username text when showUsername is true', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', username: 'alice', showUsername: true });
    expect(screen.getByText('alice')).toBeInTheDocument();
  });

  it('renders "Anonymous" label for isAnonymous when showUsername is true', () => {
    renderAvatar({ isAnonymous: true, showUsername: true });
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });

  it('does NOT render a username label when showUsername is false', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', username: 'alice', showUsername: false });
    expect(screen.queryByText('alice')).toBeNull();
  });

  it('does NOT render a label when username is omitted even if showUsername is true', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', showUsername: true });
    // No username to show — no label rendered
    expect(screen.queryByText('alice')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// clickable prop
// ---------------------------------------------------------------------------

describe('Avatar — clickable prop', () => {
  it('wraps the avatar in a Link to /users/:username when clickable is true', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', username: 'alice', clickable: true });
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/users/alice');
  });

  it('link has a descriptive aria-label', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', username: 'alice', clickable: true });
    expect(screen.getByRole('link')).toHaveAttribute('aria-label', "View alice's profile");
  });

  it('does NOT render a link when clickable is false (default)', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', username: 'alice' });
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('does NOT render a link for anonymous users even when clickable is true', () => {
    renderAvatar({ isAnonymous: true, clickable: true });
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('does NOT render a link when clickable is true but username is missing', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', clickable: true });
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renders both img and username label inside the link when showUsername+clickable', () => {
    renderAvatar({
      avatarUrl: 'https://cdn.test/pic.jpg',
      username: 'alice',
      showUsername: true,
      clickable: true,
    });
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/users/alice');
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.test/pic.jpg');
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe('Avatar — accessibility', () => {
  it('img alt is derived from username, not generic', () => {
    renderAvatar({ avatarUrl: 'https://cdn.test/pic.jpg', username: 'bob' });
    expect(screen.getByRole('img')).toHaveAttribute('alt', "bob's avatar");
  });

  it('silhouette SVG is aria-hidden (no img role noise)', () => {
    const { container } = renderAvatar({ isAnonymous: true });
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
