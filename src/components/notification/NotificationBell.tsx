import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockNotifications } from '../../utils/mockData';
import { NotificationItem } from './NotificationItem';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unread = mockNotifications.filter((n: any) => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
        aria-label={`Notifications ${unread > 0 ? `(${unread} unread)` : ''}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl animate-fadeIn overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
              <h3 className="text-sm font-bold text-on-surface">Notifications</h3>
              {unread > 0 && (
                <button className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant">
              {mockNotifications.length === 0 ? (
                <p className="text-sm text-muted-text text-center py-8">No notifications</p>
              ) : (
                mockNotifications
                  .slice(0, 5)
                  .map((n: any) => <NotificationItem key={n.id} notification={n} />)
              )}
            </div>
            <div className="px-4 py-2 border-t border-outline-variant text-center">
              <Link
                to="/notifications"
                className="text-sm text-primary hover:underline no-underline"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
