import React from 'react';
import { cn } from '../../utils/cn';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={cn('max-w-container mx-auto px-6 py-8', className)}>
      {children}
    </main>
  );
}
