import React from 'react';
import { AnalyticsCharts } from '../../components/admin/AnalyticsCharts';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { mockUsers, mockPosts, mockComments } from '../../utils/mockData';

export function AdminAnalyticsPage() {
  const stats = [
    { label: 'Total Users', value: mockUsers.length, icon: '👥' },
    { label: 'Total Posts', value: mockPosts.length, icon: '📝' },
    { label: 'Total Comments', value: mockComments.length, icon: '💬' },
    {
      label: 'Avg. Reactions/Post',
      value: Math.round(
        mockPosts.reduce((s, p) => s + p.reactions.reduce((x, r) => x + r.count, 0), 0) /
          mockPosts.length,
      ),
      icon: '❤️',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Analytics</h1>
        <p className="text-sm text-muted-text mt-1">Platform engagement overview</p>
      </div>

      <DashboardStats stats={stats} />
      <AnalyticsCharts />
    </div>
  );
}
