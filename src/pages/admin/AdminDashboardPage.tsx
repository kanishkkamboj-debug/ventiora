import React from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { Users, MessageSquare, Flag, Trash2 } from 'lucide-react';
import { mockUsers, mockPosts } from '../../utils/mockData';

export function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: mockUsers.length, icon: Users, trend: '+12.5%', isPositive: true },
    { label: "Today's Posts", value: mockPosts.length, icon: MessageSquare, trend: '— 0.0%', isPositive: true },
    { label: 'Pending Reports', value: '2', icon: Flag, trend: '↓ -2.1%', isPositive: true, isAlert: true },
    { label: 'Deleted Posts', value: '45', icon: Trash2, trend: '—', isPositive: true },
  ];

  return (
    <div className="min-h-screen bg-background flex font-mono">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-on-surface">Dashboard Overview</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-text font-semibold mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-on-surface">{stat.value}</p>
                  <p className={`text-xs font-medium mt-2 ${stat.isPositive ? 'text-green-600' : 'text-error'}`}>
                    {stat.trend}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.isAlert ? 'bg-error/10 text-error' : 'bg-primary-container/10 text-primary-container'}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
             <h2 className="text-lg font-bold mb-4">Post Distribution by Category</h2>
             <div className="h-64 flex items-end gap-2 pt-4 border-b border-l border-outline-variant pb-2 pl-2">
                {/* Mock bar chart */}
                {['Studies', 'Placements', 'Relationships', 'Memes', 'Advice'].map((cat, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                    <div 
                      className="w-full bg-primary-container rounded-t-sm group-hover:bg-primary-container/80 transition-colors" 
                      style={{ height: `${Math.random() * 80 + 20}%` }}
                    ></div>
                    <span className="text-xs text-muted-text -rotate-45 origin-top-left mt-2 whitespace-nowrap">{cat}</span>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Recent Activity</h2>
              <button className="text-xs text-primary-container font-semibold hover:underline">View All</button>
            </div>
            <div className="flex-1 space-y-4">
              {[
                { text: 'Post flagged in Campus Life — Reason: Harassment', time: '2 mins ago', type: 'alert' },
                { text: 'Auto-mod deleted a comment — Spam filter', time: '15 mins ago', type: 'mod' },
                { text: 'Admin updated platform guidelines', time: '1 hour ago', type: 'info' }
              ].map((activity, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${activity.type === 'alert' ? 'bg-error' : activity.type === 'mod' ? 'bg-muted-text' : 'bg-primary-container'}`}></div>
                  <div>
                    <p className="text-on-surface/90 font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-text mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
