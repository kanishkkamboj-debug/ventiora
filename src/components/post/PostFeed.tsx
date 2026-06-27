import React from 'react';
import type { Post } from '../../types/post.types';
import { PostCard } from './PostCard';
import { EmptyState } from '../common/EmptyState';

interface PostFeedProps {
  posts: Post[];
}

function EmptyPostsIcon() {
  return (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export function PostFeed({ posts }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<EmptyPostsIcon />}
        title="No posts yet"
        description="Be the first to start a conversation in this category."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
