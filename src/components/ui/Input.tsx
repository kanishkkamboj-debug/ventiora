import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-on-surface"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 text-on-surface-variant">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-surface-container-lowest border rounded-md px-3 py-2 text-sm text-on-surface',
              'placeholder:text-on-surface-variant/60',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15',
              'transition-colors duration-150',
              error
                ? 'border-error focus:border-error focus:ring-error/15'
                : 'border-outline-variant',
              leftAddon && 'pl-9',
              rightAddon && 'pr-9',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className,
            )}
            {...props}
          />
          {rightAddon && (
            <span className="absolute right-3 text-on-surface-variant">{rightAddon}</span>
          )}
        </div>
        {error && <p className="text-xs text-error font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-muted-text">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
