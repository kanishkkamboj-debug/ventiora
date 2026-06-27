import React from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
}

export function MarkdownEditor({ value, onChange, placeholder, error, label }: MarkdownEditorProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-on-surface">{label}</label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className={`w-full font-serif text-sm bg-surface-container-lowest border rounded-md px-3 py-2 text-on-surface resize-y focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors ${
          error ? 'border-error focus:border-error focus:ring-error/15' : 'border-outline-variant'
        }`}
      />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
      <p className="text-xs text-muted-text">Markdown formatting supported.</p>
    </div>
  );
}
