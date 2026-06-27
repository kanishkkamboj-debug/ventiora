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
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';

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
    <aside className="w-[240px] bg-surface-container h-screen fixed left-0 top-0 flex flex-col font-headline-md border-r border-border">
      <div className="p-6 pb-4">
        <h1 className="font-headline-md text-headline-md font-bold text-primary mb-1">Unfiltered Campus</h1>
        <p className="font-label-sm text-label-sm text-muted-text">Admin Control</p>
      </div>

      <div className="px-4 pb-6">
        <button className="w-full bg-primary text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-md hover:shadow-sm transition-all flex items-center justify-center gap-2">
          + New Announcement
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 font-label-md text-label-md transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border-l-4 border-primary font-bold'
                        : 'text-on-surface hover:bg-surface-container-high hover:text-primary border-l-4 border-transparent'
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

      <div className="p-4 border-t border-border bg-surface-container-high">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8">
            <Avatar avatarUrl={user?.avatar_url} username={user?.username} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-label-md font-bold truncate">@{user?.username}</p>
            <p className="font-body-sm text-body-sm text-muted-text truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 font-label-sm text-label-sm font-bold text-error hover:text-error/80 w-full px-2 transition-colors">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
