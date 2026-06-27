import React from 'react';
import type { Announcement } from '../../types/announcement.types';
import { cn } from '../../utils/cn';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const active = announcements.filter((a) => a.isActive);
  if (active.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {active.map((ann) => (
        <div
          key={ann.id}
          className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-xl border text-sm',
            ann.isHighlighted
              ? 'bg-on-primary-container border-primary/30 text-on-surface'
              : 'bg-surface-container border-outline-variant text-on-surface-variant',
          )}
        >
          <span className="text-lg shrink-0">📢</span>
          <div>
            <p className={cn('font-semibold', ann.isHighlighted ? 'text-primary' : 'text-on-surface')}>
              {ann.title}
            </p>
            <p className="text-xs mt-0.5 opacity-80">{ann.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
