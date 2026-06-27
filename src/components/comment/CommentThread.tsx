import React from 'react';
import type { Comment } from '../../types/comment.types';
import { CommentItem } from './CommentItem';

interface CommentThreadProps {
  comments: Comment[];
}

export function CommentThread({ comments }: CommentThreadProps) {
  const rootComments = comments.filter((c) => !c.parentId);

  return (
    <div className="flex flex-col gap-4">
      {rootComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
