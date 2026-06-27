import React from 'react';
import { Skeleton } from '../common/Skeleton';

export function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <div className="bg-surface-container rounded-xl p-4 space-y-2">
          <Skeleton width="w-24" />
          <Skeleton lines={2} />
        </div>
      </div>
    </div>
  );
}
