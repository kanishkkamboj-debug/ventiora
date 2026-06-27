import React, { useState } from 'react';
import { PostModerationTable } from '../../components/admin/PostModerationTable';
import { mockPosts } from '../../utils/mockData';
import { cn } from '../../utils/cn';

type FilterTab = 'all' | 'flagged';

export function AdminPostsPage() {
  const [filter, setFilter] = useState<FilterTab>('all');

  const posts = filter === 'flagged'
    ? mockPosts.filter((p) => p.isPinned || p.isFeatured || p.isLocked)
    : mockPosts;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Post Moderation</h1>
        <p className="text-sm text-muted-text mt-1">{mockPosts.length} total posts</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="flex border-b border-outline-variant px-4">
          {(['all', 'flagged'] as FilterTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                'px-4 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px',
                filter === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface',
              )}
            >
              {t === 'all' ? `All Posts (${mockPosts.length})` : 'Flagged'}
            </button>
          ))}
        </div>

        <PostModerationTable posts={posts} />
      </div>
    </div>
  );
}
