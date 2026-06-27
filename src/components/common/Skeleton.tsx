import React from 'react';
import { cn } from '../../utils/cn';

type SkeletonVariant = 'line' | 'card' | 'avatar';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
  lines?: number;
}

export function Skeleton({ variant = 'line', width, height, className, lines = 1 }: SkeletonProps) {
  if (variant === 'avatar') {
    return (
      <div
        className={cn(
          'rounded-full shimmer',
          width ?? 'w-10',
          height ?? 'h-10',
          className,
        )}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'rounded-xl shimmer',
          width ?? 'w-full',
          height ?? 'h-40',
          className,
        )}
      />
    );
  }

  // line variant
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded shimmer',
            i === lines - 1 && lines > 1 ? 'w-3/4' : width ?? 'w-full',
          )}
          style={height ? { height } : undefined}
        />
      ))}
    </div>
  );
}
