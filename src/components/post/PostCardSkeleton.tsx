import React from 'react';
import { Skeleton } from '../common/Skeleton';

export function PostCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton width="w-16" />
      </div>
      <Skeleton lines={2} />
      <Skeleton lines={2} height="h-3" width="w-3/4" />
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
        <div className="flex items-center gap-2">
          <Skeleton variant="avatar" />
          <Skeleton width="w-24" />
        </div>
        <Skeleton width="w-16" />
      </div>
    </div>
  );
}
