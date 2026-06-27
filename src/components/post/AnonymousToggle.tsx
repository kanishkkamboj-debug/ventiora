import React, { useState } from 'react';
import { Switch } from '../common/Switch';

interface AnonymousToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export function AnonymousToggle({ value, onChange }: AnonymousToggleProps) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="flex items-center gap-3 relative">
      <Switch
        checked={value}
        onChange={onChange}
        label="Post anonymously"
        description='Your name will be shown as "Anonymous"'
      />
      <button
        type="button"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        className="text-on-surface-variant/60 hover:text-on-surface-variant transition-colors"
        aria-label="Anonymous info"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {showTip && (
        <div className="absolute left-0 top-full mt-1 z-10 bg-inverse-surface text-inverse-on-surface text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg">
          When anonymous, your username is hidden from all viewers. Only admins can see the actual author.
        </div>
      )}
    </div>
  );
}
