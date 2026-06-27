import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { NotificationBell } from '../notification/NotificationBell';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest border-b border-outline-variant shadow-sm">
      <div className="max-w-container mx-auto px-6 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex-shrink-0 text-lg font-extrabold text-primary tracking-tight no-underline hover:no-underline"
        >
          Unfiltered Campus
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-surface-container border border-outline-variant rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
            />
          </div>
        </form>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {isAuthenticated && user ? (
            <>
              <NotificationBell />
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/posts/new')}
                className="hidden sm:inline-flex"
              >
                + New Post
              </Button>

              {/* User avatar dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <Avatar
                    avatarUrl={user.avatarUrl}
                    username={user.username}
                    size="sm"
                  />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-10 z-20 w-52 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-outline-variant">
                        <p className="text-sm font-semibold text-on-surface">{user.username}</p>
                        <p className="text-xs text-muted-text truncate">{user.email}</p>
                      </div>
                      <Link
                        to={`/users/${user.username}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors no-underline"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors no-underline"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Notifications
                      </Link>
                      {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors no-underline"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-surface-container transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded text-on-surface-variant hover:bg-surface-container"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search + menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-outline-variant px-4 py-3 bg-surface-container-lowest space-y-3">
          <form onSubmit={handleSearch}>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full px-3 py-2 text-sm bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
            />
          </form>
          {isAuthenticated && (
            <Button variant="primary" size="sm" className="w-full" onClick={() => { navigate('/posts/new'); setMobileMenuOpen(false); }}>
              + New Post
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
