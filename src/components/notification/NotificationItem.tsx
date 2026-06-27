import React from 'react';
import type { Notification } from '../../types/notification.types';
import { formatRelative } from '../../utils/dateFormat';
import { Bell, Heart, MessageCircle, AlertTriangle, Pin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'REACTION_ON_POST':
      case 'REACTION_ON_COMMENT':
        return <Heart className="w-4 h-4 text-error" />;
      case 'COMMENT_ON_POST':
      case 'REPLY_TO_COMMENT':
        return <MessageCircle className="w-4 h-4 text-primary" />;
      case 'ACCOUNT_WARNING':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'POST_PINNED':
        return <Pin className="w-4 h-4 text-primary" />;
      case 'POST_FEATURED':
        return <Star className="w-4 h-4 text-secondary" />;
      default:
        return <Bell className="w-4 h-4 text-muted-text" />;
    }
  };

  const getTargetLink = () => {
    if (notification.targetType === 'POST' && notification.targetId) {
      return `/posts/${notification.targetId}`;
    }
    return '#'; // Fallback
  };

  return (
    <Link 
      to={getTargetLink()}
      className={`block p-4 hover:bg-surface-container-low transition-colors ${
        !notification.isRead ? 'bg-primary/5' : ''
      }`}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center shadow-sm">
            {getIcon()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-on-surface line-clamp-2">
            <span className="font-semibold">{notification.actorUsername || 'System'}</span>{' '}
            {notification.message}
          </p>
          <span className="text-xs text-muted-text mt-1 block">
            {formatRelative(notification.createdAt)}
          </span>
        </div>
        {!notification.isRead && (
          <div className="shrink-0 flex items-center">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
        )}
      </div>
    </Link>
  );
}
