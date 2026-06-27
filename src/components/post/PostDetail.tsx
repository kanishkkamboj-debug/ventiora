import React from 'react';
import type { Post } from '../../types/post.types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { TagList } from './TagList';
import { PostActions } from './PostActions';
import { ReactionBar } from '../reaction/ReactionBar';
import { formatFull, formatRelative } from '../../utils/dateFormat';
import { Link } from 'react-router-dom';

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
  const authorName = post.author.isAnonymous ? 'Anonymous' : post.author.user.username;
  const authorAvatar = post.author.isAnonymous ? undefined : post.author.user.avatarUrl;

  return (
    <article className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6">
      {/* Badges */}
      {(post.isPinned || post.isFeatured) && (
        <div className="flex gap-2 mb-4">
          {post.isPinned && <Badge variant="primary">📌 Pinned</Badge>}
          {post.isFeatured && <Badge variant="warning">⭐ Featured</Badge>}
        </div>
      )}

      {/* Category */}
      <Link
        to={`/?category=${post.category.slug}`}
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary no-underline hover:underline mb-2"
      >
        {post.category.emoji} {post.category.name}
      </Link>

      {/* Title */}
      <h1 className="text-2xl font-bold text-on-surface mb-4 leading-tight">
        {post.title}
      </h1>

      {/* Author + meta */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
        <Avatar avatarUrl={authorAvatar} username={authorName} isAnonymous={post.author.isAnonymous} size="md" />
        <div>
          <p className="text-sm font-semibold text-on-surface">{authorName}</p>
          <p className="text-xs text-muted-text" title={formatFull(post.createdAt)}>
            {formatRelative(post.createdAt)} · {post.viewCount.toLocaleString()} views
          </p>
        </div>
        <div className="ml-auto">
          <PostActions post={post} />
        </div>
      </div>

      {/* Content */}
      <div className="prose-post mb-6">
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Tags */}
      <div className="mb-6">
        <TagList tags={post.tags} />
      </div>

      {/* Reactions */}
      <div className="pt-4 border-t border-outline-variant">
        <p className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-3">
          Reactions
        </p>
        <ReactionBar reactions={post.reactions} />
      </div>
    </article>
  );
}
