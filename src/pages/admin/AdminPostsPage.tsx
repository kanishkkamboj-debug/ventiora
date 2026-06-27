import React from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { mockPosts } from '../../utils/mockData';

export function AdminPostsPage() {
  return (
    <div className="min-h-screen bg-background flex font-mono">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-on-surface">Post Management</h1>
        </header>
        <div className="bg-white rounded-xl border border-outline-variant p-8 text-center text-muted-text">
          Post management coming soon. Total posts: {mockPosts.length}
        </div>
      </div>
    </div>
  );
}
