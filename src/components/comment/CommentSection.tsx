import React from 'react';
import type { Comment } from '../../types/comment.types';
import { CommentThread } from './CommentThread';
import { CommentForm } from './CommentForm';
import { EmptyState } from '../common/EmptyState';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  isLocked?: boolean;
}

export function CommentSection({ postId, comments, isLocked }: CommentSectionProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 mt-6">
      <h2 className="text-base font-bold text-on-surface mb-5">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {isLocked ? (
        <div className="bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface-variant mb-5">
          🔒 Comments are locked on this post.
        </div>
      ) : (
        <div className="mb-6">
          <CommentForm postId={postId} />
        </div>
      )}

      {comments.length === 0 ? (
        <EmptyState
          title="No comments yet"
          description="Be the first to share your thoughts!"
        />
      ) : (
        <CommentThread comments={comments} />
      )}
    </div>
  );
}
