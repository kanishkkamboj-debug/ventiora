import React from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { Users, MessageSquare, Flag, Trash2, Edit } from 'lucide-react';


export function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '14,205', icon: Users, trend: '+12.5%', isPositive: true },
    { label: 'Active Users (7D)', value: '3,842', icon: Users, trend: '+4.2%', isPositive: true },
    { label: 'Total Posts', value: '124,510', icon: MessageSquare, trend: '—', isPositive: null },
    { label: "Today's Posts", value: '428', icon: MessageSquare, trend: '— 0.0%', isPositive: null },
    { label: 'Pending Reports', value: '12', icon: Flag, trend: '↓ -2.1%', isAlert: true },
    { label: 'Deleted Posts', value: '1,245', icon: Trash2, trend: '—', isPositive: null },
  ];

  return (
    <div className="min-h-screen bg-background flex font-headline-md">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Dashboard Overview</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-surface rounded-xl p-6 border border-border shadow-sm flex items-start justify-between">
                <div>
                  <p className="font-label-sm text-label-sm text-muted-text font-semibold mb-1">{stat.label}</p>
                  <p className="font-headline-xl-mobile text-headline-xl-mobile font-bold text-on-surface">{stat.value}</p>
                  <p className={`font-label-sm text-label-sm font-semibold mt-2 ${stat.isPositive ? 'text-green-600' : stat.isAlert ? 'text-error' : 'text-muted-text'}`}>
                    {stat.trend}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.isAlert ? 'bg-error/10 text-error' : 'bg-surface-container-low text-muted-text'}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6 shadow-sm">
             <h2 className="font-headline-md text-headline-md font-bold mb-4">Post Distribution by Category</h2>
             <div className="h-[300px] flex items-end gap-3 pt-4 border-b border-l border-border pb-2 pl-2">
                {/* Mock bar chart matching prompt heights */}
                {[
                  { name: 'Studies', h: '95%' },
                  { name: 'Relationships', h: '60%' },
                  { name: 'Placements', h: '50%' },
                  { name: 'Mental Health', h: '75%' },
                  { name: 'Memes', h: '45%' },
                  { name: 'Gaming', h: '35%' },
                  { name: 'Finance', h: '25%' },
                  { name: 'College Life', h: '40%' },
                  { name: 'Advice', h: '55%' },
                  { name: 'Confessions', h: '85%' },
                ].map((cat, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group h-full">
                    <div 
                      className="w-full bg-primary rounded-t-sm group-hover:bg-primary/80 transition-colors" 
                      style={{ height: cat.h }}
                    ></div>
                    <span className="font-label-sm text-label-sm text-muted-text -rotate-45 origin-top-left mt-2 whitespace-nowrap">
                      {cat.name}
                    </span>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-headline-md font-bold">Recent Activity</h2>
              <button className="font-label-sm text-label-sm text-primary font-bold hover:underline">View All</button>
            </div>
            <div className="flex-1 space-y-6">
              {[
                { text: 'Post flagged in Campus Life — Reason: Harassment', time: '2 mins ago', icon: Flag, color: 'text-error', bg: 'bg-error/10' },
                { text: 'Auto-mod deleted a comment — Spam filter triggered', time: '15 mins ago', icon: Trash2, color: 'text-muted-text', bg: 'bg-surface-container-high' },
                { text: 'Admin updated platform guidelines — Terms of Service', time: '1 hour ago', icon: Edit, color: 'text-primary', bg: 'bg-primary/10' },
                { text: 'User reported by multiple peers — Review needed', time: '2 hours ago', icon: Flag, color: 'text-error', bg: 'bg-error/10' }
              ].map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className={`mt-0.5 w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${activity.bg} ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold leading-snug">{activity.text}</p>
                      <p className="font-label-sm text-label-sm text-muted-text mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
