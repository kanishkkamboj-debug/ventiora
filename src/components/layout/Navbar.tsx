import React, { useState, useRef } from 'react';
import { Search, Bell, Moon, Sun, Palette, Menu, X, LogOut, User as UserIcon, LayoutDashboard, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Avatar } from '../ui/Avatar';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, mode, toggleMode } = useTheme();
  
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(themeMenuRef, () => setShowThemeMenu(false));

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(userMenuRef, () => setShowUserMenu(false));

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
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
          <div className="flex items-center gap-2 md:gap-4 ml-6 shrink-0">
            
            {/* Theme Dropdown */}
            <div className="relative" ref={themeMenuRef}>
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                aria-label="Change Theme"
                className="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary/50 outline-none transition-colors duration-200 text-on-surface-variant active:scale-95"
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

            <button aria-label="Messages" onClick={() => navigate('/messages')} className="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary/50 outline-none transition-colors duration-200 text-on-surface-variant active:scale-95 relative hidden sm:block">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full"></span>
            </button>

            {isAuthenticated ? (
              <div className="relative ml-2 hidden sm:block" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User Menu"
                  className="rounded-full focus-visible:ring-2 focus-visible:ring-primary/50 outline-none"
                >
                  <Avatar avatarUrl={user?.avatar_url} username={user?.username} size="sm" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-border">
                      <p className="font-semibold text-sm text-on-surface truncate">@{user?.username}</p>
                      <p className="text-xs text-muted-text">{user?.role}</p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <Link onClick={() => setShowUserMenu(false)} to={`/users/${user?.username}`} className="px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg flex items-center gap-2">
                        <UserIcon className="w-4 h-4" /> Profile
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link onClick={() => setShowUserMenu(false)} to="/admin" className="px-3 py-2 text-sm hover:bg-surface-container-low rounded-lg text-primary font-medium flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={() => { logout(); setShowUserMenu(false); }} className="px-3 py-2 text-sm text-left hover:bg-surface-container-low rounded-lg text-error flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="font-label-md text-label-md bg-primary text-on-primary px-4 py-2 rounded-full hover:shadow-[0_2px_8px_rgba(var(--primary),0.2)] transition-all active:scale-95 hidden sm:block">
                Log In
              </button>
            )}
            
            <button 
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"} 
              className="md:hidden p-2 text-on-surface focus-visible:ring-2 focus-visible:ring-primary/50 outline-none rounded-md hover:bg-surface-container-low transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-surface dark:bg-inverse-surface z-40 overflow-y-auto md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-gutter py-6 flex flex-col gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low dark:bg-inverse-surface border border-border dark:border-outline-variant rounded-xl text-label-md font-label-md focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/search');
                }}
              />
            </div>
            
            <nav className="flex flex-col gap-2 font-headline-md text-headline-md font-bold">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl text-primary bg-primary/10"
              >
                Discussions
              </Link>
              <Link 
                to="/communities" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors"
              >
                Communities
              </Link>
              <Link 
                to="/resources" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors"
              >
                Resources
              </Link>
            </nav>

            <div className="h-px bg-border my-2" />

            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 px-2">
                  <Avatar avatarUrl={user?.avatar_url} username={user?.username} size="md" />
                  <div>
                    <p className="font-bold text-on-surface">@{user?.username}</p>
                    <p className="font-body-sm text-body-sm text-muted-text">{user?.role}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link 
                    onClick={() => setIsMobileMenuOpen(false)}
                    to={`/users/${user?.username}`} 
                    className="py-3 px-4 rounded-xl text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-3 font-label-md text-label-md"
                  >
                    <UserIcon className="w-5 h-5" /> Profile
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link 
                      onClick={() => setIsMobileMenuOpen(false)}
                      to="/admin" 
                      className="py-3 px-4 rounded-xl text-primary hover:bg-surface-container-low transition-colors flex items-center gap-3 font-label-md text-label-md"
                    >
                      <LayoutDashboard className="w-5 h-5" /> Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                    className="py-3 px-4 rounded-xl text-error hover:bg-error/10 transition-colors flex items-center gap-3 font-label-md text-label-md text-left w-full"
                  >
                    <LogOut className="w-5 h-5" /> Log out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} 
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-sm active:scale-95 transition-all"
              >
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
