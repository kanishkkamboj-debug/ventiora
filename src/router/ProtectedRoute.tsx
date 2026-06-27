import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Wire up real auth check in Step 8 — for now, just render children
  return <>{children}</>;
}
