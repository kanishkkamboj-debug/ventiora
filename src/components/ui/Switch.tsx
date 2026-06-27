import React from 'react';
import { cn } from './Button';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className="flex items-start gap-4 cursor-pointer">
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <div className="h-6 w-11 rounded-full bg-surface-container-high transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-container peer-checked:bg-primary-container peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
          <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all peer-checked:translate-x-full peer-checked:bg-on-primary-container"></div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-sm font-semibold text-on-surface">{label}</span>}
            {description && <span className="text-sm text-muted-text">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';
