import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { PostFeed } from '../components/post/PostFeed';
import { Avatar } from '../components/common/Avatar';
import { mockPosts, mockUsers } from '../utils/mockData';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

type SearchTab = 'posts' | 'users';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') ?? '';
  const [tab, setTab] = useState<SearchTab>('posts');
  const [inputVal, setInputVal] = useState(query);

  const matchedPosts = mockPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.content.toLowerCase().includes(query.toLowerCase()),
  );

  const matchedUsers = mockUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.bio?.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`);
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        {/* Search input */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search posts, users…"
              className="w-full pl-12 pr-4 py-3 text-base bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
            />
          </div>
        </form>

        {query && (
          <p className="text-sm text-muted-text mb-4">
            Showing results for <span className="font-semibold text-on-surface">"{query}"</span>
          </p>
        )}

        {/* Tabs */}
        <div className="flex border-b border-outline-variant mb-5">
          {(['posts', 'users'] as SearchTab[]).map((t) => (
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
              {t === 'posts' ? `Posts (${matchedPosts.length})` : `Users (${matchedUsers.length})`}
            </button>
          ))}
        </div>

        {/* Results */}
        {tab === 'posts' && <PostFeed posts={matchedPosts} />}

        {tab === 'users' && (
          <div className="flex flex-col gap-3">
            {matchedUsers.length === 0 ? (
              <p className="text-sm text-muted-text text-center py-10">No users found.</p>
            ) : (
              matchedUsers.map((user) => (
                <Link
                  key={user.id}
                  to={`/users/${user.username}`}
                  className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 no-underline hover:shadow-md transition-all"
                >
                  <Avatar avatarUrl={user.avatarUrl} username={user.username} size="md" />
                  <div>
                    <p className="font-semibold text-on-surface">{user.username}</p>
                    {user.bio && <p className="text-sm text-muted-text line-clamp-1">{user.bio}</p>}
                    <p className="text-xs text-muted-text mt-0.5">
                      {user.postCount} posts · {user.commentCount} comments
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
