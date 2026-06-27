import React, { useState } from 'react';
import { AuditLogTable } from '../../components/admin/AuditLogTable';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { mockAuditLogs } from '../../utils/mockData';
import { AUDIT_ACTION_LABELS } from '../../utils/constants';

const ACTION_OPTIONS = [
  { value: '', label: 'All Actions' },
  ...Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => ({ value, label })),
];

export function AdminAuditLogPage() {
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = mockAuditLogs.filter((log) => {
    const matchAction = !actionFilter || log.action === actionFilter;
    const matchDate = !dateFilter || log.createdAt.startsWith(dateFilter);
    return matchAction && matchDate;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Audit Log</h1>
        <p className="text-sm text-muted-text mt-1">
          Read-only record of all admin actions. {filtered.length} entries.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="w-64">
          <Select
            options={ACTION_OPTIONS}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder="Filter by action…"
          />
        </div>
        <div className="w-48">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filter by date"
          />
        </div>
        {(actionFilter || dateFilter) && (
          <button
            onClick={() => { setActionFilter(''); setDateFilter(''); }}
            className="text-sm text-primary hover:underline self-end mb-1"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-text text-center py-10">No audit log entries found.</p>
        ) : (
          <AuditLogTable logs={filtered} />
        )}
      </div>
    </div>
  );
}
