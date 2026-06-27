import React, { useState } from 'react';
import type { Comment } from '../../types/comment.types';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { formatRelative } from '../../utils/dateFormat';
import { CommentForm } from './CommentForm';
import { ReportButton } from '../report/ReportButton';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const { user } = useAuth();

  const authorName = comment.author.isAnonymous ? 'Anonymous' : comment.author.user.username;
  const authorAvatar = comment.author.isAnonymous ? undefined : comment.author.user.avatarUrl;

  return (
    <div className={cn('flex gap-3', isReply && 'ml-10 mt-3')}>
      <Avatar
        avatarUrl={authorAvatar}
        username={authorName}
        isAnonymous={comment.author.isAnonymous}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-surface-container rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-on-surface">{authorName}</span>
            <span className="text-xs text-muted-text">{formatRelative(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed font-serif">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1.5 ml-2">
          {!isReply && user && (
            <button
              onClick={() => setShowReply((o) => !o)}
              className="text-xs text-muted-text hover:text-primary transition-colors"
            >
              ↩ Reply
            </button>
          )}
          {user && (
            <ReportButton
              targetType="COMMENT"
              targetId={comment.id}
              compact
            />
          )}
        </div>

        {/* Reply form */}
        {showReply && (
          <div className="mt-2">
            <CommentForm
              postId={comment.postId}
              parentId={comment.id}
              onCancel={() => setShowReply(false)}
              compact
            />
          </div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
