import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  // Wire up real admin check in Step 8 — for now, wrap in AdminLayout
  return <AdminLayout>{children}</AdminLayout>;
}
