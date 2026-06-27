import React from 'react';
import { Button } from '../ui/Button';

interface ReplyToggleProps {
  replyCount: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function ReplyToggle({ replyCount, isOpen, onToggle }: ReplyToggleProps) {
  if (replyCount === 0) return null;

  return (
    <button
      onClick={onToggle}
      className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
    >
      {isOpen ? '▲ Hide' : '▼ View'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
    </button>
  );
}
