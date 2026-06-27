import React from 'react';
import { cn } from '../../utils/cn';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  avatarUrl?: string;
  username?: string;
  isAnonymous?: boolean;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { px: number; cls: string }> = {
  sm: { px: 32, cls: 'w-8 h-8 text-xs' },
  md: { px: 40, cls: 'w-10 h-10 text-sm' },
  lg: { px: 64, cls: 'w-16 h-16 text-lg' },
  xl: { px: 96, cls: 'w-24 h-24 text-2xl' },
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

export function Avatar({ avatarUrl, username, isAnonymous, size = 'md', className }: AvatarProps) {
  const { cls } = sizeMap[size];

  if (isAnonymous || !avatarUrl) {
    return <AnonymousSilhouette size={size} />;
  }

  return (
    <img
      src={avatarUrl}
      alt={username ?? 'User avatar'}
      className={cn(cls, 'rounded-full object-cover flex-shrink-0 bg-surface-container', className)}
    />
  );
}
