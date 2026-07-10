/**
 * NotificationBell — bell icon + dropdown for the Navbar.
 *
 * Designed to be mounted directly inside the Navbar actions row.
 * The component manages its own open/close state so it stays
 * self-contained; when real Supabase data arrives (Prompt 27) the
 * mockNotifications reads below get swapped for an API hook.
 *
 * Accessibility contract:
 *  - Bell button exposes aria-expanded + aria-haspopup="listbox"
 *  - Unread badge has an sr-only accessible label
 *  - Dropdown closes on Escape and on click-outside
 *  - "Mark all read" is a real button with an onClick handler
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockNotifications } from '../../utils/mockData';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '../../types/notification.types';

export function NotificationBell() {
  // -------------------------------------------------------------------------
  // State — mock-backed; Prompt 27 replaces with a real API hook
  // -------------------------------------------------------------------------
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unread = notifications.filter((n) => !n.isRead).length;

  // -------------------------------------------------------------------------
  // Refs for click-outside detection
  // -------------------------------------------------------------------------
  const containerRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleToggle = useCallback(() => setOpen((o) => !o), []);
  const handleClose  = useCallback(() => setOpen(false), []);

  /** Mark all notifications as read (mock; no network call yet). */
  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  // Close on click-outside
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (open && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, handleClose]);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (open && e.key === 'Escape') {
        handleClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, handleClose]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="relative" ref={containerRef}>
      {/* Bell button */}
      <button
        id="notification-bell-btn"
        onClick={handleToggle}
        aria-label={
          unread > 0
            ? `Notifications — ${unread} unread`
            : 'Notifications'
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="notification-dropdown"
        className="relative p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary/50 outline-none transition-colors duration-200 text-on-surface-variant active:scale-95"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />

        {/* Unread badge */}
        {unread > 0 && (
          <span
            aria-label={`${unread} unread notification${unread !== 1 ? 's' : ''}`}
            className="absolute top-1.5 right-1.5 min-w-[1rem] h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none pointer-events-none"
          >
            <span aria-hidden="true">{unread > 9 ? '9+' : unread}</span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          id="notification-dropdown"
          role="listbox"
          aria-label="Notifications"
          className="absolute right-0 top-12 z-50 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden"
          // Prevent clicks inside the dropdown from propagating to the
          // document-level pointerdown handler and immediately closing it
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
            <h2 className="text-sm font-bold text-on-surface">Notifications</h2>
            {unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Items */}
          <ul
            className="max-h-80 overflow-y-auto divide-y divide-outline-variant"
            aria-label="Notification list"
          >
            {notifications.length === 0 ? (
              <li className="text-sm text-muted-text text-center py-8">
                No notifications
              </li>
            ) : (
              notifications
                .slice(0, 5)
                .map((n) => (
                  <li key={n.id} onClick={handleClose}>
                    <NotificationItem notification={n} />
                  </li>
                ))
            )}
          </ul>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-outline-variant text-center">
            <Link
              to="/notifications"
              onClick={handleClose}
              className="text-sm text-primary hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
