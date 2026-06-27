import React from 'react';
import type { AuditLog } from '../../types/auditlog.types';
import { formatFull } from '../../utils/dateFormat';
import { AUDIT_ACTION_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';

interface AuditLogTableProps {
  logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-xs font-semibold text-muted-text uppercase tracking-wider">
            <th className="text-left py-3 px-4">Admin</th>
            <th className="text-left py-3 px-4">Action</th>
            <th className="text-left py-3 px-4">Target Type</th>
            <th className="text-left py-3 px-4">Target ID</th>
            <th className="text-left py-3 px-4">Timestamp</th>
            <th className="text-left py-3 px-4">Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {logs.map((log, idx) => (
            <tr
              key={log.id}
              className={cn(
                'hover:bg-surface-container transition-colors',
                idx % 2 !== 0 && 'bg-surface-container-low',
              )}
            >
              <td className="py-3 px-4 font-semibold text-on-surface">{log.adminUsername}</td>
              <td className="py-3 px-4">
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-surface-container text-on-surface-variant">
                  {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                </span>
              </td>
              <td className="py-3 px-4 text-on-surface-variant text-xs">{log.targetType}</td>
              <td className="py-3 px-4 text-on-surface-variant font-mono text-xs">{log.targetId}</td>
              <td className="py-3 px-4 text-on-surface-variant text-xs">
                {formatFull(log.createdAt)}
              </td>
              <td className="py-3 px-4 text-on-surface-variant max-w-xs">
                {log.note ?? <span className="text-muted-text">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
