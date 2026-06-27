import React from 'react';
import { AnnouncementComposer } from '../../components/admin/AnnouncementComposer';
import { mockAnnouncements } from '../../utils/mockData';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatShort } from '../../utils/dateFormat';

export function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Announcements</h1>
        <p className="text-sm text-muted-text mt-1">Broadcast messages to all users</p>
      </div>

      <AnnouncementComposer />

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-outline-variant">
          <h2 className="text-sm font-bold text-on-surface">Published Announcements</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-xs font-semibold text-muted-text uppercase tracking-wider">
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Highlighted</th>
              <th className="text-left py-3 px-4">Active</th>
              <th className="text-left py-3 px-4">Expires</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {mockAnnouncements.map((ann, idx) => (
              <tr
                key={ann.id}
                className={idx % 2 !== 0 ? 'bg-surface-container-low' : ''}
              >
                <td className="py-3 px-4 font-medium text-on-surface max-w-xs">
                  <p className="line-clamp-1">{ann.title}</p>
                  <p className="text-xs text-muted-text">by {ann.createdByUsername}</p>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={ann.isHighlighted ? 'primary' : 'secondary'}>
                    {ann.isHighlighted ? 'Yes' : 'No'}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={ann.isActive ? 'success' : 'outline'}>
                    {ann.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-on-surface-variant text-xs">
                  {ann.expiresAt ? formatShort(ann.expiresAt) : '—'}
                </td>
                <td className="py-3 px-4 text-right">
                  <Button variant="destructive" size="sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
