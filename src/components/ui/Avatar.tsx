import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  avatarUrl?: string;
  username?: string;
  isAnonymous?: boolean;
  size?: AvatarSize;
  className?: string;
  /**
   * When true, renders the `username` as a text label next to the avatar image.
   * No-op when `isAnonymous` is true (the label becomes "Anonymous").
   * Defaults to false.
   */
  showUsername?: boolean;
  /**
   * When true AND `username` is provided, wraps the avatar (and optional label)
   * in a `<Link to="/users/:username">` for profile navigation.
   * Ignored when `isAnonymous` is true.
   * Defaults to false.
   */
  clickable?: boolean;
}

const sizeMap: Record<AvatarSize, { cls: string }> = {
  sm: { cls: 'w-8 h-8 text-xs' },
  md: { cls: 'w-10 h-10 text-sm' },
  lg: { cls: 'w-16 h-16 text-lg' },
  xl: { cls: 'w-24 h-24 text-2xl' },
};

function AnonymousSilhouette({ size }: { size: AvatarSize }) {
  const { cls } = sizeMap[size];
  return (
    <div
      className={cn(
        cls,
        'rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0',
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-[55%] h-[55%] text-on-surface-variant"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
          fill="currentColor"
        />
        <path
          d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function Avatar({
  avatarUrl,
  username,
  isAnonymous,
  size = 'md',
  className,
  showUsername = false,
  clickable = false,
}: AvatarProps) {
  const { cls } = sizeMap[size];

  // ── Anonymous branch ────────────────────────────────────────────────────
  if (isAnonymous) {
    return (
      <div className="flex items-center gap-2">
        <AnonymousSilhouette size={size} />
        {showUsername && (
          <span className="text-sm font-medium text-on-surface-variant italic">
            Anonymous
          </span>
        )}
      </div>
    );
  }

  // ── Avatar image (or fallback silhouette when no URL) ───────────────────
  const avatarImg = avatarUrl ? (
    <img
      src={avatarUrl}
      alt={username ? `${username}'s avatar` : 'User avatar'}
      className={cn(
        cls,
        'rounded-full object-cover flex-shrink-0 bg-surface-container',
        className,
      )}
    />
  ) : (
    <AnonymousSilhouette size={size} />
  );

  // ── Content: avatar + optional username label ───────────────────────────
  const content =
    showUsername && username ? (
      <div className="flex items-center gap-2">
        {avatarImg}
        <span className="text-sm font-semibold text-on-surface">{username}</span>
      </div>
    ) : (
      avatarImg
    );

  // ── Clickable wrapper (Link to profile) ────────────────────────────────
  if (clickable && username) {
    return (
      <Link
        to={`/users/${username}`}
        className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
        aria-label={`View ${username}'s profile`}
      >
        {content}
      </Link>
    );
  }

  return <>{content}</>;
}
