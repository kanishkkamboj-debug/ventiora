import React from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';

export function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-background flex font-mono">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-on-surface">Reports & Moderation</h1>
        </header>
        
        <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="text-error mt-0.5">⚠️</div>
          <div>
            <h3 className="text-error font-bold text-sm">Priority Alert: SELF_HARM_CONCERN</h3>
            <p className="text-xs text-error/80 mt-1">1 report requires immediate review. Standard moderation queue is paused until this is resolved.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant p-8 text-center text-muted-text">
          Report moderation tools coming soon.
        </div>
      </div>
    </div>
  );
}
