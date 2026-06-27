import React from 'react';
import { Link } from 'react-router-dom';
import { mockCategories } from '../../utils/mockData';
import { mockPosts } from '../../utils/mockData';

function TrendingWidget() {
  const topPosts = [...mockPosts]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
      <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
        ðŸ”¥ Trending
      </h3>
      <ol className="space-y-3">
        {topPosts.map((post, idx) => (
          <li key={post.id} className="flex gap-2.5 items-start">
            <span className="text-xs font-bold text-on-surface-variant/50 w-4 shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <Link
                to={`/posts/${post.id}`}
                className="text-xs font-semibold text-on-surface hover:text-primary line-clamp-2 no-underline transition-colors"
              >
                {post.title}
              </Link>
              <span className="text-xs text-muted-text mt-1 block">
                {post.viewCount.toLocaleString()} views
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CategoryLinks() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
      <h3 className="text-sm font-bold text-on-surface mb-3">Categories</h3>
      <ul className="space-y-1">
        {mockCategories.map((cat: any) => (
          <li key={cat.id}>
            <Link
              to={`/?category=${cat.slug}`}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-container text-sm text-on-surface no-underline transition-colors"
            >
              <span>
                {cat.emoji} {cat.name}
              </span>
              <span className="text-xs text-muted-text">{cat.postCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-4 w-full">
      <TrendingWidget />
      <CategoryLinks />
      <div className="text-xs text-muted-text space-y-1 px-1">
        <p className="font-semibold text-on-surface-variant">Ventiora</p>
        <p>The honest student forum.</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Link to="/about" className="hover:text-primary transition-colors no-underline">About</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors no-underline">Privacy</Link>
          <Link to="/terms" className="hover:text-primary transition-colors no-underline">Terms</Link>
        </div>
        <p className="mt-2">Â© 2026 Ventiora</p>
      </div>
    </aside>
  );
}
