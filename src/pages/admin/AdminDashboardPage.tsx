import React from 'react';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { mockUsers, mockPosts, mockReports, mockCategories, mockAuditLogs } from '../../utils/mockData';
import { formatRelative } from '../../utils/dateFormat';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { AUDIT_ACTION_LABELS } from '../../utils/constants';

export function AdminDashboardPage() {
  const stats = [
    {
      label: 'Total Users',
      value: mockUsers.length,
      icon: '👥',
      trend: '+2 this week',
      trendUp: true,
    },
    {
      label: 'Posts Today',
      value: mockPosts.filter((p) => {
        const d = new Date(p.createdAt);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length,
      icon: '📝',
      trend: '+5 vs yesterday',
      trendUp: true,
    },
    {
      label: 'Pending Reports',
      value: mockReports.filter((r) => r.status === 'PENDING').length,
      icon: '🚩',
      trend: 'Action required',
      trendUp: false,
    },
    {
      label: 'Active Categories',
      value: mockCategories.filter((c) => c.isActive).length,
      icon: '🏷️',
    },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
        <p className="text-sm text-muted-text mt-1">Welcome back to Unfiltered Campus admin.</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
          <h2 className="text-sm font-bold text-on-surface mb-4">Recent Audit Activity</h2>
          <div className="space-y-3">
            {mockAuditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-on-surface-variant text-xs mt-0.5">🔹</span>
                <div>
                  <p className="text-sm text-on-surface">
                    <span className="font-semibold">{log.adminUsername}</span>{' '}
                    {AUDIT_ACTION_LABELS[log.action]?.toLowerCase()}
                  </p>
                  <p className="text-xs text-muted-text">{formatRelative(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/audit-log" className="text-xs text-primary hover:underline mt-4 block no-underline">
            View full audit log →
          </Link>
        </div>

        {/* Quick actions */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
          <h2 className="text-sm font-bold text-on-surface mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Link to="/admin/reports">
              <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                🚩 Review Pending Reports ({mockReports.filter((r) => r.status === 'PENDING').length})
              </Button>
            </Link>
            <Link to="/admin/announcements">
              <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                📢 Create Announcement
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                👥 Manage Users
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                📊 View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
