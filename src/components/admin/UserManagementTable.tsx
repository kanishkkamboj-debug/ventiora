import React, { useState } from 'react';
import type { User } from '../../types/user.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatShort } from '../../utils/dateFormat';
import { ROLE_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';

interface UserManagementTableProps {
  users: (User & { post_count?: number })[];
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const [actionMsg, setActionMsg] = useState<string>('');

  const doAction = (action: string, username: string) => {
    setActionMsg(`${action} action applied to ${username}`);
    setTimeout(() => setActionMsg(''), 3000);
  };

  return (
    <div>
      {actionMsg && (
        <div className="mb-3 px-4 py-2 bg-on-primary-container text-primary text-sm rounded-lg border border-primary/20">
          ✓ {actionMsg}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-xs font-semibold text-muted-text uppercase tracking-wider">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Joined</th>
              <th className="text-left py-3 px-4">Posts</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {users.map((user, idx) => (
              <tr
                key={user.id}
                className={cn(
                  'transition-colors hover:bg-surface-container',
                  idx % 2 === 0 ? '' : 'bg-surface-container-low',
                )}
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-semibold text-on-surface">{user.username}</p>
                    <p className="text-xs text-muted-text">{user.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      user.role === 'ADMIN'
                        ? 'destructive'
                        : user.role === 'MODERATOR'
                        ? 'primary'
                        : 'secondary'
                    }
                  >
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      user.is_banned
                        ? 'destructive'
                        : user.is_suspended
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {user.is_banned ? 'BANNED' : user.is_suspended ? 'SUSPENDED' : 'ACTIVE'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">
                  {formatShort(user.created_at)}
                </td>
                <td className="py-3 px-4 text-on-surface-variant">{user.post_count ?? 0}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => doAction('Suspend', user.username)}
                    >
                      Suspend
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => doAction('Ban', user.username)}
                    >
                      Ban
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
