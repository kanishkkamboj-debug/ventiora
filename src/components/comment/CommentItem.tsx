import React, { useState } from 'react';
import type { Comment } from '../../types/comment.types';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { formatRelative } from '../../utils/dateFormat';
import { CommentForm } from './CommentForm';
import { ReportButton } from '../report/ReportButton';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import { resolveUsername } from '../../utils/anonymity';

interface CommentItemProps {
  comment: Comment;
  level?: number;
}

export function CommentItem({ comment, level = 0 }: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const { user } = useAuth();

  // Single top-level flag — never read from comment.author.isAnonymous
  const isAnonymous = comment.isAnonymous;
  const displayName = isAnonymous ? 'Anonymous' : `@${resolveUsername(false, comment.author) ?? 'Anonymous'}`;
  const isMaxDepth = level >= 3;

  return (
    <div className={`flex gap-3 ${level > 0 ? 'mt-4' : 'mt-6'} animate-fadeIn`}>
      <div className="shrink-0">
        {isAnonymous ? (
          <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="text-on-surface-variant font-medium text-sm">?</span>
          </div>
        ) : (
          <Avatar username={resolveUsername(isAnonymous, comment.author)} size="sm" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="bg-surface rounded-2xl p-4 border border-outline-variant shadow-sm">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className={`font-semibold text-sm ${isAnonymous ? 'text-on-surface-variant' : 'text-on-surface'}`}>
              {displayName}
            </span>
            <span className="text-xs text-on-surface-variant">
              {formatRelative(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed font-serif">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1.5 ml-2">
          {level === 0 && user && (
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
        {comment.replies && comment.replies.length > 0 && !isMaxDepth && (
          <div className="mt-1">
            {comment.replies.map((reply: Comment) => (
              <CommentItem key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
