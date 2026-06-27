import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin top bar */}
      <header className="h-12 bg-inverse-surface text-inverse-on-surface flex items-center px-6 gap-4 sticky top-0 z-30">
        <Link to="/" className="text-sm font-bold no-underline text-inverse-on-surface/80 hover:text-inverse-on-surface">
          ← Back to Forum
        </Link>
        <span className="text-inverse-on-surface/40">|</span>
        <span className="text-sm font-semibold text-inverse-on-surface">Admin Panel</span>
        <div className="ml-auto text-sm text-inverse-on-surface/70">
          Signed in as <span className="font-semibold text-inverse-on-surface">{user?.username}</span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left sidebar */}
        <aside className="w-56 shrink-0 bg-surface-container-lowest border-r border-outline-variant min-h-screen">
          <AdminSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-background min-h-screen overflow-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
