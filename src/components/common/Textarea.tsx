import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-on-surface">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-surface-container-lowest border rounded-md px-3 py-2 text-sm text-on-surface',
            'placeholder:text-on-surface-variant/60 resize-y min-h-[120px]',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15',
            'transition-colors duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:border-error focus:ring-error/15'
              : 'border-outline-variant',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-error font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-muted-text">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
