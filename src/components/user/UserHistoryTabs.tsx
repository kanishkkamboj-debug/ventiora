import React, { useState } from 'react';
import { mockPosts, mockComments } from '../../utils/mockData';
import { PostCard } from '../widgets/PostCard';
import { formatRelative } from '../../utils/dateFormat';
import { cn } from '../../utils/cn';

type Tab = 'posts' | 'comments';

interface UserHistoryTabsProps {
  userId: string;
  username: string;
}

export function UserHistoryTabs({ userId, username: _username }: UserHistoryTabsProps) {
  const [tab, setTab] = useState<Tab>('posts');

  const userPosts = mockPosts.filter(
    (p) => !p.is_anonymous && p.user_id === userId,
  );
  const userComments = mockComments.filter(
    (c) => !c.is_anonymous && c.user_id === userId,
  );

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex border-b border-outline-variant mb-5">
        {(['posts', 'comments'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px',
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface',
            )}
          >
            {t === 'posts' ? `Posts (${userPosts.length})` : `Comments (${userComments.length})`}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div className="flex flex-col gap-4">
          {userPosts.length === 0 ? (
            <p className="text-sm text-muted-text">No public posts yet.</p>
          ) : (
            userPosts.map((p) => <PostCard key={p.id} post={p as any} />)
          )}
        </div>
      )}

      {tab === 'comments' && (
        <div className="flex flex-col gap-3">
          {userComments.length === 0 ? (
            <p className="text-sm text-muted-text">No public comments yet.</p>
          ) : (
            userComments.map((c) => (
              <div
                key={c.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4"
              >
                <p className="text-sm font-serif text-on-surface">{c.content}</p>
                <p className="text-xs text-muted-text mt-2">{formatRelative(c.created_at)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
