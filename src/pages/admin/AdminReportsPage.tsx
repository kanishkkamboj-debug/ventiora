import React from 'react';
import { ReportQueue } from '../../components/admin/ReportQueue';
import { mockReports } from '../../utils/mockData';

export function AdminReportsPage() {
  const pending = mockReports.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Report Queue</h1>
        <p className="text-sm text-muted-text mt-1">
          {pending} pending report{pending !== 1 ? 's' : ''} requiring review
        </p>
        {pending > 0 && mockReports.some((r) => r.reason === 'SELF_HARM_CONCERN' && r.status === 'PENDING') && (
          <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-800">
            ⚠️ There is a self-harm concern report that needs immediate attention.
          </div>
        )}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
        <ReportQueue reports={mockReports} />
      </div>
    </div>
  );
}
