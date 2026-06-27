import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types/post.types';
import { formatRelative } from '../../utils/dateFormat';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { ReactionBar } from '../reaction/ReactionBar';
import { cn } from '../../utils/cn';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const authorName =
    post.author.isAnonymous ? 'Anonymous' : post.author.user.username;
  const authorAvatar =
    post.author.isAnonymous ? undefined : post.author.user.avatarUrl;

  const totalReactions = post.reactions.reduce((sum, r) => sum + r.count, 0);

  return (
    <article
      className={cn(
        'bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5',
      )}
    >
      {/* Pinned / Featured badges */}
      {(post.isPinned || post.isFeatured) && (
        <div className="flex gap-2 mb-3">
          {post.isPinned && <Badge variant="primary">📌 Pinned</Badge>}
          {post.isFeatured && <Badge variant="warning">⭐ Featured</Badge>}
        </div>
      )}

      {/* Category chip */}
      <div className="flex items-center gap-2 mb-2">
        <Link
          to={`/?category=${post.category.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline no-underline"
        >
          {post.category.emoji} {post.category.name}
        </Link>
        {post.isLocked && (
          <Badge variant="outline">🔒 Locked</Badge>
        )}
      </div>

      {/* Title */}
      <Link
        to={`/posts/${post.id}`}
        className="no-underline group"
      >
        <h2 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {post.title}
        </h2>
      </Link>

      {/* Content preview */}
      <p className="text-sm text-on-surface-variant line-clamp-2 mb-3 font-serif">
        {post.content.slice(0, 180)}…
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-outline-variant">
        {/* Author */}
        <div className="flex items-center gap-2">
          <Avatar
            avatarUrl={authorAvatar}
            username={authorName}
            isAnonymous={post.author.isAnonymous}
            size="sm"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-on-surface">
              {authorName}
            </span>
            <span className="text-[11px] text-muted-text">
              {formatRelative(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-text">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {post.viewCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.commentCount}
          </span>
          {totalReactions > 0 && (
            <span className="flex items-center gap-1">
              {post.reactions.find((r) => r.count > 0)?.type === 'LIKE' ? '👍' : '❤️'}
              {totalReactions}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
