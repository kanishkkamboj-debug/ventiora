import React, { useState } from 'react';
import type { TargetType } from '../../types/common.types';
import { ReportModal } from './ReportModal';
import { cn } from '../../utils/cn';

interface ReportButtonProps {
  targetType: TargetType;
  targetId: string;
  compact?: boolean;
}

export function ReportButton({ targetType, targetId, compact }: ReportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'text-muted-text hover:text-error transition-colors',
          compact ? 'text-xs' : 'text-sm flex items-center gap-1',
        )}
        title="Report"
      >
        <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
        {!compact && ' Report'}
      </button>
      <ReportModal
        isOpen={open}
        onClose={() => setOpen(false)}
        targetType={targetType}
        targetId={targetId}
      />
    </>
  );
}
