import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { TargetType } from '../../types/common.types';
import type { ReportReason } from '../../types/report.types';
import { REPORT_REASON_LABELS } from '../../utils/constants';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: TargetType;
  targetId: string;
}

const reasons: ReportReason[] = [
  'SPAM',
  'HARASSMENT',
  'MISINFORMATION',
  'INAPPROPRIATE_CONTENT',
  'SELF_HARM_CONCERN',
  'OTHER',
];

export function ReportModal({ isOpen, onClose, targetType, targetId }: ReportModalProps) {
  const [selected, setSelected] = useState<ReportReason | ''>('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    // Mock submit
    setSubmitted(true);
  };

  const handleClose = () => {
    setSelected('');
    setDescription('');
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Report Content"
      footer={
        submitted ? (
          <Button onClick={handleClose}>Done</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!selected}>Submit Report</Button>
          </>
        )
      }
    >
      {submitted ? (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">✅</div>
          <p className="font-semibold text-on-surface">Report submitted</p>
          <p className="text-sm text-muted-text mt-1">
            Our moderation team will review this shortly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            Why are you reporting this {targetType.toLowerCase()}?
          </p>

          <div className="flex flex-col gap-2">
            {reasons.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selected === reason
                    ? 'border-primary bg-on-primary-container'
                    : 'border-outline-variant hover:bg-surface-container'
                }`}
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={reason}
                  checked={selected === reason}
                  onChange={() => setSelected(reason)}
                  className="accent-primary"
                />
                <span className={`text-sm ${reason === 'SELF_HARM_CONCERN' ? 'font-semibold text-error' : 'text-on-surface'}`}>
                  {REPORT_REASON_LABELS[reason]}
                </span>
              </label>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-on-surface mb-1 block">
              Additional details <span className="text-muted-text font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide more context…"
              className="w-full text-sm bg-surface-container-lowest border border-outline-variant rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
