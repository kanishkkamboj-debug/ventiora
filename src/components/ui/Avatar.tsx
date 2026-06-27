import React from 'react';
import { cn } from './Button';
import type { User } from '../../types/user.types';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: User;
  isAnonymous?: boolean;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  fallback?: string;
}

export function Avatar({ className, user, isAnonymous, size = 'md', src, fallback, ...props }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  };

  const getInitials = () => {
    if (isAnonymous) return '?';
    if (fallback) return fallback;
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  const isMasked = isAnonymous;
  const avatarSrc = isMasked ? undefined : (src || user?.avatar_url);

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold',
        isMasked ? 'bg-surface-container-high text-muted-text border border-outline-variant' : 'bg-primary-container text-on-primary-container',
        sizes[size],
        className
      )}
      {...props}
    >
      {avatarSrc ? (
        <img src={avatarSrc} alt={user?.username || 'Avatar'} className="h-full w-full object-cover" />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  );
}
