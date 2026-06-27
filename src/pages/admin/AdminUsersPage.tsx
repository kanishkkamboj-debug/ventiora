import React from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { mockUsers } from '../../utils/mockData';
import { Avatar } from '../../components/ui/Avatar';
import { Search, Filter, MoreVertical } from 'lucide-react';

export function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-background flex font-headline-md">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">User Management</h1>
        </header>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest rounded-xl font-body-sm text-body-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-surface-container-lowest border border-border rounded-xl font-label-md text-label-md font-bold flex items-center gap-2 hover:bg-surface-container-low transition-colors">
            <Filter className="h-4 w-4" /> Status: All
          </button>
        </div>

        <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low font-label-sm text-label-sm text-muted-text border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Joined</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-body-sm text-body-sm">
              {mockUsers.map(u => (
                <tr key={u.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8">
                        <Avatar user={u as any} size="sm" />
                      </div>
                      <span className="font-bold text-on-surface">@{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-text">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${
                      u.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-muted-text'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${
                      u.is_banned ? 'bg-error/10 text-error' : 
                      u.is_suspended ? 'bg-primary/10 text-primary' : 
                      'bg-[#D1FAE5] text-[#065F46]'
                    }`}>
                      {u.is_banned ? 'BANNED' : u.is_suspended ? 'SUSPENDED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-text">{new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-surface-container-low rounded-full transition-colors text-muted-text">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-border font-label-sm text-label-sm text-muted-text flex justify-between items-center">
            <span>Showing 1 to {mockUsers.length} of {mockUsers.length} users</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-border rounded-md hover:bg-surface-container-low transition-colors disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 border border-border rounded-md hover:bg-surface-container-low transition-colors disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
