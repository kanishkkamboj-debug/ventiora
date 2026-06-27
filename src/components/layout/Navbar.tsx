import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Palette, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../ui/Avatar';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, mode, toggleMode } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <nav className="bg-surface dark:bg-inverse-surface w-full top-0 sticky shadow-sm dark:shadow-none z-50">
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-16">
        {/* Brand & Search */}
        <div className="flex items-center gap-6 flex-1">
          <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed shrink-0">
            Unfiltered Campus
          </Link>
          <div className="hidden md:flex relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search discussions..." 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low dark:bg-inverse-surface border border-border dark:border-outline-variant rounded-full text-label-md font-label-md focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none"
              onClick={() => navigate('/search')}
            />
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-label-md text-label-md">
          <Link to="/" className="text-primary dark:text-primary-fixed font-bold border-b-2 border-primary dark:border-primary-fixed pb-1 h-full flex items-center pt-1">
            Discussions
          </Link>
          <Link to="/communities" className="text-on-secondary-container dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed h-full flex items-center pt-1 transition-colors duration-200">
            Communities
          </Link>
          <Link to="/resources" className="text-on-secondary-container dark:text-on-secondary-fixed-variant hover:text-primary dark:hover:text-primary-fixed h-full flex items-center pt-1 transition-colors duration-200">
            Resources
          </Link>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4 ml-6 shrink-0">
          
          {/* Theme Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container transition-colors duration-200 text-on-surface-variant active:scale-95"
              title="Change Theme"
            >
              <Palette className="w-5 h-5" />
            </button>
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-2 flex flex-col">
                  <button onClick={() => { setTheme('theme-1'); setShowThemeMenu(false); }} className={`px-4 py-2 text-left text-sm font-medium hover:bg-surface-container-low rounded-lg ${theme === 'theme-1' ? 'text-primary' : 'text-on-surface'}`}>Teal / Cyan</button>
                  <button onClick={() => { setTheme('theme-2'); setShowThemeMenu(false); }} className={`px-4 py-2 text-left text-sm font-medium hover:bg-surface-container-low rounded-lg ${theme === 'theme-2' ? 'text-primary' : 'text-on-surface'}`}>Sage Green (Default)</button>
                  <button onClick={() => { setTheme('theme-3'); setShowThemeMenu(false); }} className={`px-4 py-2 text-left text-sm font-medium hover:bg-surface-container-low rounded-lg ${theme === 'theme-3' ? 'text-primary' : 'text-on-surface'}`}>Blue / Gold</button>
                  <button onClick={() => { setTheme('theme-4'); setShowThemeMenu(false); }} className={`px-4 py-2 text-left text-sm font-medium hover:bg-surface-container-low rounded-lg ${theme === 'theme-4' ? 'text-primary' : 'text-on-surface'}`}>Purple</button>
                </div>
              </div>
            )}
          </div>

          <button onClick={toggleMode} aria-label="Toggle Dark Mode" className="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary/50 outline-none transition-colors duration-200 text-on-surface-variant active:scale-95" title="Toggle Dark Mode">
            {mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button aria-label="Notifications" className="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary/50 outline-none transition-colors duration-200 text-on-surface-variant active:scale-95 relative hidden sm:block">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-error rounded-full"></span>
          </button>

          {isAuthenticated ? (
             <div className="relative group cursor-pointer ml-2">
               <Avatar avatarUrl={user?.avatar_url} username={user?.username} size="sm" />
               <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                 <div className="p-3 border-b border-border">
                   <p className="font-semibold text-sm text-on-surface">@{user?.username}</p>
                   <p className="text-xs text-muted-text">{user?.role}</p>
                 </div>
                 <div className="p-2 flex flex-col gap-1">
                   <Link to={`/users/${user?.username}`} className="px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg">Profile</Link>
                   {user?.role === 'ADMIN' && (
                     <Link to="/admin" className="px-3 py-2 text-sm hover:bg-surface-container-low rounded-lg text-primary font-medium">Admin Panel</Link>
                   )}
                   <button onClick={logout} className="px-3 py-2 text-sm text-left hover:bg-surface-container-low rounded-lg text-error">Log out</button>
                 </div>
               </div>
             </div>
          ) : (
            <button onClick={() => navigate('/login')} className="font-label-md text-label-md bg-primary text-on-primary px-4 py-2 rounded-full hover:shadow-[0_2px_8px_rgba(var(--primary),0.2)] transition-all active:scale-95 hidden sm:block">
              Log In
            </button>
          )}
          
          <button aria-label="Menu" className="md:hidden p-2 text-on-surface focus-visible:ring-2 focus-visible:ring-primary/50 outline-none rounded-md">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
