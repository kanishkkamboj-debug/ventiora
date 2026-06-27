import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { NotificationItem } from '../components/notification/NotificationItem';
import { Button } from '../components/common/Button';
import { mockNotifications } from '../utils/mockData';
import type { Notification } from '../types/notification.types';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAllRead = () => {
    setNotifications((ns) => ns.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-on-surface">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-text mt-0.5">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl mb-2">🔔</p>
              <p className="text-sm text-muted-text">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
