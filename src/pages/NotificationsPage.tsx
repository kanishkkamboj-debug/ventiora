import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Bell, Heart, MessageCircle } from 'lucide-react';

export function NotificationsPage() {
  const notifications = [
    { id: 1, type: 'comment', text: 'Someone commented on your post "How to survive finals week..."', time: '2 hours ago', unread: true },
    { id: 2, type: 'reaction', text: 'Someone reacted to your comment in "FAANG Interview Tips"', time: '1 day ago', unread: false },
  ];

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary-container" />
          Notifications
        </h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant divide-y divide-outline-variant">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-4 hover:bg-surface transition-colors cursor-pointer flex gap-4 ${notif.unread ? 'bg-primary-container/5' : ''}`}>
              <div className="mt-1">
                {notif.type === 'comment' ? (
                  <div className="bg-primary-container/20 p-2 rounded-full text-primary-container">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="bg-error/20 p-2 rounded-full text-error">
                    <Heart className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${notif.unread ? 'font-semibold text-on-surface' : 'text-on-surface/80'}`}>
                  {notif.text}
                </p>
                <p className="text-xs text-muted-text mt-1">{notif.time}</p>
              </div>
              {notif.unread && (
                <div className="h-2 w-2 bg-primary-container rounded-full self-center"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
