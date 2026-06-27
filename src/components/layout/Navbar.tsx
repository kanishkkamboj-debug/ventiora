import React from 'react';
import { Search, Bell, Menu, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-outline-variant shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-primary-container flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            Unfiltered Campus
          </Link>
          <div className="hidden md:flex relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text h-4 w-4" />
            <input
              type="text"
              placeholder="Search posts, tags, or categories..."
              className="w-full pl-10 pr-4 py-2 bg-surface rounded-full text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container"
              onClick={() => navigate('/search')}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => navigate('/posts/new')}>
                + New Post
              </Button>
              <button onClick={() => navigate('/notifications')} className="p-2 text-muted-text hover:bg-surface rounded-full transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-error rounded-full"></span>
              </button>
              <div className="relative group cursor-pointer">
                <Avatar user={user!} size="sm" />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-outline-variant rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-outline-variant">
                    <p className="font-semibold text-sm">@{user?.username}</p>
                    <p className="text-xs text-muted-text">{user?.role}</p>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <Link to={`/users/${user?.username}`} className="px-3 py-2 text-sm hover:bg-surface rounded-lg">Profile</Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" className="px-3 py-2 text-sm hover:bg-surface rounded-lg text-primary-container font-medium">Admin Panel</Link>
                    )}
                    <button onClick={logout} className="px-3 py-2 text-sm text-left hover:bg-surface rounded-lg text-error">Log out</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
              <Button onClick={() => navigate('/register')}>Sign up</Button>
            </div>
          )}
          <button className="md:hidden p-2 text-on-surface">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
