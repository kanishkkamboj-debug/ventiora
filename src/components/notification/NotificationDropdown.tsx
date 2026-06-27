import React from 'react';
import { mockNotifications } from '../../utils/mockData';
import { NotificationItem } from './NotificationItem';

export function NotificationDropdown() {
  return (
    <div className="divide-y divide-outline-variant">
      {mockNotifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
