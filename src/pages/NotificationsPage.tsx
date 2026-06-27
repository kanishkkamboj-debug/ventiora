import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { mockNotifications } from '../utils/mockData';
import { NotificationItem } from '../components/notification/NotificationItem';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  
  const displayedNotifications = mockNotifications.filter(n => 
    activeTab === 'all' ? true : !n.isRead
  );

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-background">Notifications</h1>
          {unreadCount > 0 && (
            <button className="text-primary font-label-md font-semibold hover:underline">
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-outline-variant mb-6 relative">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 font-label-lg font-semibold relative ${
              activeTab === 'all' ? 'text-primary' : 'text-muted-text hover:text-on-surface'
            }`}
          >
            All
            {activeTab === 'all' && (
              <motion.div 
                layoutId="notif-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`pb-3 font-label-lg font-semibold relative flex items-center gap-2 ${
              activeTab === 'unread' ? 'text-primary' : 'text-muted-text hover:text-on-surface'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'unread' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'
              }`}>
                {unreadCount}
              </span>
            )}
            {activeTab === 'unread' && (
              <motion.div 
                layoutId="notif-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
              />
            )}
          </button>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden divide-y divide-outline-variant">
          <AnimatePresence mode="popLayout">
            {displayedNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📭</span>
                </div>
                <h3 className="font-title-md font-bold text-on-surface mb-1">You're all caught up!</h3>
                <p className="text-muted-text text-sm">No {activeTab === 'unread' ? 'unread ' : ''}notifications right now.</p>
              </motion.div>
            ) : (
              displayedNotifications.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <NotificationItem notification={n} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
