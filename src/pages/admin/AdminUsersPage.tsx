import React from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { mockUsers } from '../../utils/mockData';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, MoreVertical } from 'lucide-react';

export function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-background flex font-mono">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-on-surface">User Management</h1>
        </header>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-outline-variant rounded-lg text-sm font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" /> Status: All
          </button>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-container-high text-xs uppercase text-muted-text border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {mockUsers.map(u => (
                <tr key={u.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar user={u as any} size="sm" />
                      <span className="font-semibold text-on-surface">@{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-text">{u.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === 'ADMIN' ? 'primary' : 'secondary'}>{u.role}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.is_banned ? 'error' : u.is_suspended ? 'outline' : 'secondary'} className={!u.is_banned && !u.is_suspended ? 'bg-green-100 text-green-800' : ''}>
                      {u.is_banned ? 'BANNED' : u.is_suspended ? 'SUSPENDED' : 'ACTIVE'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-text">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-surface rounded">
                      <MoreVertical className="h-4 w-4 text-muted-text" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-outline-variant text-sm text-muted-text flex justify-between items-center">
            <span>Showing 1 to {mockUsers.length} of {mockUsers.length} users</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-outline-variant rounded disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 border border-outline-variant rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
