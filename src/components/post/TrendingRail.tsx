import React from 'react';
import { Link } from 'react-router-dom';
import { mockPosts } from '../../utils/mockData';

export function TrendingRail() {
  const topPosts = [...mockPosts]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
        🔥 Trending Posts
      </h3>
      <ol className="space-y-3">
        {topPosts.map((post, idx) => (
          <li key={post.id} className="flex gap-2.5 items-start">
            <span className="text-sm font-bold text-on-surface-variant/40 w-5 shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <Link
                to={`/posts/${post.id}`}
                className="text-sm font-medium text-on-surface hover:text-primary line-clamp-2 no-underline transition-colors"
              >
                {post.title}
              </Link>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-text">
                <span>{post.category.emoji} {post.category.name}</span>
                <span>·</span>
                <span>{post.viewCount.toLocaleString()} views</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
