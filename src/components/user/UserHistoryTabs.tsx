import React, { useState } from 'react';
import { mockPosts, mockComments } from '../../utils/mockData';
import { PostCard } from '../widgets/PostCard';
import { cn } from '../../utils/cn';
import { authorHasUser } from '../../utils/anonymity';

// NOTE (Prompt 26): replace mockPosts/mockComments here with real Supabase
// queries (usersApi.getUserPosts, usersApi.getUserComments) keyed by userId.

type Tab = 'posts' | 'comments';

interface UserHistoryTabsProps {
  userId: string;
  username: string;
}

export function UserHistoryTabs({ userId, username: _username }: UserHistoryTabsProps) {
  const [tab, setTab] = useState<Tab>('posts');

  const userPosts = mockPosts.filter(
    (p) => !p.isAnonymous && authorHasUser(p.author) && p.author.user.id === userId,
  );
  const userComments = mockComments.filter(
    (c) => !c.isAnonymous && authorHasUser(c.author) && c.author.user.id === userId,
  );

  return (
    <div>
      {/* Tab switcher — ARIA tablist for keyboard/screen-reader access */}
      <div
        role="tablist"
        aria-label="User history"
        className="flex border-b border-outline-variant mb-5"
      >
        {(['posts', 'comments'] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`tabpanel-${t}`}
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

      {/* Posts panel */}
      <div
        role="tabpanel"
        id="tabpanel-posts"
        aria-labelledby="tab-posts"
        hidden={tab !== 'posts'}
      >
        {tab === 'posts' && (
          <div className="flex flex-col gap-4">
            {userPosts.length === 0 ? (
              <p className="text-sm text-muted-text">No public posts yet.</p>
            ) : (
              userPosts.map((p) => <PostCard key={p.id} post={p as any} />)
            )}
          </div>
        )}
      </div>

      {/* Comments panel */}
      <div
        role="tabpanel"
        id="tabpanel-comments"
        aria-labelledby="tab-comments"
        hidden={tab !== 'comments'}
      >
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
                  <p className="text-xs text-muted-text mt-2 font-serif">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
