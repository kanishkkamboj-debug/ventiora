import React from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { Megaphone } from 'lucide-react';

export function AdminAnnouncementsPage() {
  return (
    <div className="min-h-screen bg-background flex font-headline-md">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Announcements</h1>
        </header>
        <div className="bg-surface rounded-xl border border-border p-12 text-center text-muted-text flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
            <Megaphone className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">Global announcements coming soon</h2>
          <p className="font-body-md text-body-md max-w-md mx-auto">You'll soon be able to broadcast messages to all students directly from this panel.</p>
        </div>
      </div>
    </div>
  );
}
