import React, { useState } from 'react';
import { UserManagementTable } from '../../components/admin/UserManagementTable';
import { Input } from '../../components/common/Input';
import { Pagination } from '../../components/common/Pagination';
import { mockUsers } from '../../utils/mockData';
import type { User } from '../../types/user.types';

const PAGE_SIZE = 5;

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = mockUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">User Management</h1>
        <p className="text-sm text-muted-text mt-1">{mockUsers.length} total users</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="p-4 border-b border-outline-variant">
          <Input
            placeholder="Search by username or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            leftAddon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        <UserManagementTable users={paginated} />

        <div className="p-4 border-t border-outline-variant">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
