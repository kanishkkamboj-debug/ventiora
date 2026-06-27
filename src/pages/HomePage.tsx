import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Sidebar } from '../components/layout/Sidebar';
import { PostFeed } from '../components/post/PostFeed';
import { CategoryFilterBar } from '../components/category/CategoryFilterBar';
import { AnnouncementBanner } from '../components/announcement/AnnouncementBanner';
import { mockPosts, mockCategories, mockAnnouncements } from '../utils/mockData';
import type { SortMode } from '../types/post.types';
import { cn } from '../utils/cn';

const SORT_TABS: { label: string; value: SortMode }[] = [
  { label: 'Trending', value: 'TRENDING' },
  { label: 'New', value: 'NEW' },
  { label: 'Top', value: 'TOP' },
];

function sortPosts(posts: typeof mockPosts, mode: SortMode) {
  const copy = [...posts];
  if (mode === 'NEW') return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (mode === 'TOP') return copy.sort((a, b) => b.reactions.reduce((s, r) => s + r.count, 0) - a.reactions.reduce((s, r) => s + r.count, 0));
  // TRENDING: viewCount + comments
  return copy.sort((a, b) => (b.viewCount + b.commentCount * 10) - (a.viewCount + a.commentCount * 10));
}

export function HomePage() {
  const [sort, setSort] = useState<SortMode>('TRENDING');
  const [categoryId, setCategoryId] = useState<string | undefined>();

  const filtered = mockPosts
    .filter((p) => !categoryId || p.category.id === categoryId);
  const sorted = sortPosts(filtered, sort);

  return (
    <PageWrapper className="py-6">
      <AnnouncementBanner announcements={mockAnnouncements} />

      <div className="flex gap-6">
        {/* Main feed */}
        <div className="flex-1 min-w-0">
          {/* Category filter */}
          <div className="mb-4">
            <CategoryFilterBar
              categories={mockCategories}
              activeId={categoryId}
              onSelect={setCategoryId}
            />
          </div>

          {/* Sort tabs */}
          <div className="flex border-b border-outline-variant mb-5">
            {SORT_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSort(tab.value)}
                className={cn(
                  'px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px',
                  sort === tab.value
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <PostFeed posts={sorted} />
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <Sidebar />
        </div>
      </div>
    </PageWrapper>
  );
}
