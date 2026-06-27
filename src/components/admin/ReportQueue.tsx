import React, { useState } from 'react';
import type { Report } from '../../types/report.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatShort } from '../../utils/dateFormat';
import { REPORT_REASON_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';

interface ReportQueueProps {
  reports: Report[];
}

export function ReportQueue({ reports }: ReportQueueProps) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const sortedReports = [...reports].sort((a, b) => {
    if (a.reason === 'SELF_HARM_CONCERN' && b.reason !== 'SELF_HARM_CONCERN') return -1;
    if (b.reason === 'SELF_HARM_CONCERN' && a.reason !== 'SELF_HARM_CONCERN') return 1;
    return 0;
  });

  const handleAction = (id: string, action: 'ACCEPTED' | 'REJECTED') => {
    setStatuses((s) => ({ ...s, [id]: action }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-xs font-semibold text-muted-text uppercase tracking-wider">
            <th className="text-left py-3 px-4">Target</th>
            <th className="text-left py-3 px-4">Reason</th>
            <th className="text-left py-3 px-4">Reporter</th>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {sortedReports.map((report, idx) => {
            const isSelfHarm = report.reason === 'SELF_HARM_CONCERN';
            const status = statuses[report.id] ?? report.status;

            return (
              <tr
                key={report.id}
                className={cn(
                  'transition-colors hover:bg-surface-container',
                  idx % 2 !== 0 && 'bg-surface-container-low',
                  isSelfHarm && 'border-l-4 border-l-amber-400',
                )}
              >
                <td className="py-3 px-4">
                  <p className="text-xs text-muted-text">{report.targetType}</p>
                  <p className="font-medium text-on-surface line-clamp-1 max-w-[200px]">
                    {report.targetPreview}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      isSelfHarm ? 'text-amber-600' : 'text-on-surface-variant',
                    )}
                  >
                    {REPORT_REASON_LABELS[report.reason]}
                  </span>
                  {report.description && (
                    <p className="text-xs text-muted-text mt-0.5 max-w-[180px] line-clamp-1">
                      {report.description}
                    </p>
                  )}
                </td>
                <td className="py-3 px-4 text-on-surface-variant">{report.reporter.username}</td>
                <td className="py-3 px-4 text-on-surface-variant">{formatShort(report.createdAt)}</td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      status === 'ACCEPTED'
                        ? 'success'
                        : status === 'REJECTED'
                        ? 'destructive'
                        : 'warning'
                    }
                  >
                    {status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  {status === 'PENDING' ? (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAction(report.id, 'ACCEPTED')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction(report.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-text text-right block">
                      Resolved
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
