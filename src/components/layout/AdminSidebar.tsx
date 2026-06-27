import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Flag, 
  Tags, 
  Megaphone, 
  BarChart3, 
  ActivitySquare,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export function AdminSidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Posts', path: '/admin/posts', icon: MessageSquare },
    { name: 'Reports', path: '/admin/reports', icon: Flag },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Audit Log', path: '/admin/audit', icon: ActivitySquare },
  ];

  return (
    <aside className="w-64 bg-surface-container-high h-screen fixed left-0 top-0 flex flex-col border-r border-outline-variant">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary-container">Unfiltered Campus</h1>
        <p className="text-xs text-muted-text mt-1 uppercase tracking-wider font-semibold">Admin Control</p>
      </div>

      <div className="px-4 pb-4">
        <Button fullWidth className="gap-2">
          + New Announcement
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-container/10 text-primary-container border-l-4 border-primary-container'
                        : 'text-on-surface hover:bg-surface-container-highest hover:text-primary-container border-l-4 border-transparent'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-outline-variant bg-surface-container-highest/50">
        <div className="flex items-center gap-3 mb-4">
          <Avatar user={user!} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">@{user?.username}</p>
            <p className="text-xs text-muted-text truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-error hover:text-error/80 w-full px-2">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
