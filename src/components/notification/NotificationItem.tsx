import React from 'react';
import { Link } from 'react-router-dom';
import type { Notification, NotificationType } from '../../types/notification.types';
import { formatRelative } from '../../utils/dateFormat';
import { cn } from '../../utils/cn';

const typeIcon: Record<NotificationType, string> = {
  COMMENT_ON_POST: '💬',
  REPLY_TO_COMMENT: '↩️',
  REACTION_ON_POST: '❤️',
  REACTION_ON_COMMENT: '👍',
  POST_PINNED: '📌',
  POST_FEATURED: '⭐',
  ACCOUNT_WARNING: '⚠️',
  ANNOUNCEMENT: '📢',
};

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const target =
    notification.targetType === 'POST'
      ? `/posts/${notification.targetId}`
      : notification.targetType === 'COMMENT'
      ? `/posts/${notification.targetId}`
      : '/notifications';

  return (
    <Link
      to={target}
      className={cn(
        'flex items-start gap-3 px-4 py-3 no-underline transition-colors',
        notification.isRead
          ? 'hover:bg-surface-container'
          : 'bg-on-primary-container/30 hover:bg-on-primary-container/40',
      )}
    >
      <span className="text-lg shrink-0 mt-0.5">
        {typeIcon[notification.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs leading-snug', notification.isRead ? 'text-on-surface-variant' : 'text-on-surface font-medium')}>
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-text mt-0.5">
          {formatRelative(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}
    </Link>
  );
}
