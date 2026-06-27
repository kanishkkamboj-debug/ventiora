import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
    </svg>
  );
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <NavIcon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    to: '/admin',
  },
  {
    label: 'Users',
    icon: <NavIcon d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    to: '/admin/users',
  },
  {
    label: 'Posts',
    icon: <NavIcon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    to: '/admin/posts',
  },
  {
    label: 'Reports',
    icon: <NavIcon d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
    to: '/admin/reports',
  },
  {
    label: 'Categories',
    icon: <NavIcon d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />,
    to: '/admin/categories',
  },
  {
    label: 'Announcements',
    icon: <NavIcon d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />,
    to: '/admin/announcements',
  },
  {
    label: 'Analytics',
    icon: <NavIcon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    to: '/admin/analytics',
  },
  {
    label: 'Audit Log',
    icon: <NavIcon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    to: '/admin/audit-log',
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1 py-4">
      {navItems.map((item) => {
        const isActive =
          item.to === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium no-underline transition-all duration-150',
              isActive
                ? 'bg-on-primary-container text-primary'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
