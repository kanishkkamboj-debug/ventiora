import React from 'react';
import { Navbar } from './Navbar';
import { TrendingRail } from '../widgets/TrendingRail';

interface PageWrapperProps {
  children: React.ReactNode;
  showTrending?: boolean;
}

export function PageWrapper({ children, showTrending = false }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {showTrending ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {children}
            </div>
            <div className="hidden lg:block">
              <TrendingRail />
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
