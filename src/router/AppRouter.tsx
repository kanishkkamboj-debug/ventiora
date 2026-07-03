import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
// Pages
import { HomePage } from '../pages/HomePage';
import { PostDetailPage } from '../pages/PostDetailPage';
import { CreatePostPage } from '../pages/CreatePostPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SearchPage } from '../pages/SearchPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { MessagesPage } from '../pages/MessagesPage';
import { TermsPage } from '../pages/TermsPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { GuidelinesPage } from '../pages/GuidelinesPage';
import { ResourcesPage } from '../pages/ResourcesPage';
import { CommunitiesPage } from '../pages/CommunitiesPage';
import { CommunityChatPage } from '../pages/CommunityChatPage';

// Admin pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminPostsPage } from '../pages/admin/AdminPostsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminAnnouncementsPage } from '../pages/admin/AdminAnnouncementsPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';
import { AdminAuditLogPage } from '../pages/admin/AdminAuditLogPage';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />
      <Route
        path="/posts/:id"
        element={
          <PublicLayout>
            <PostDetailPage />
          </PublicLayout>
        }
      />
      <Route
        path="/posts/new"
        element={
          <PublicLayout>
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          </PublicLayout>
        }
      />
      <Route
        path="/posts/:id/edit"
        element={
          <PublicLayout>
            <ProtectedRoute>
              <CreatePostPage editMode />
            </ProtectedRoute>
          </PublicLayout>
        }
      />
      <Route
        path="/search"
        element={
          <PublicLayout>
            <SearchPage />
          </PublicLayout>
        }
      />
      <Route
        path="/users/:username"
        element={
          <PublicLayout>
            <ProfilePage />
          </PublicLayout>
        }
      />
      {/*
        ⚠️  NEVER wrap /login in <ProtectedRoute>.
        Doing so creates an infinite redirect loop:
          unauthenticated user → /login (protected) → redirect to /login → …
        /login, /register, /forgot-password, and /reset-password must always
        remain bare public <Route> elements.
      */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/notifications"
        element={
          <PublicLayout>
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          </PublicLayout>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/terms"
        element={
          <PublicLayout>
            <TermsPage />
          </PublicLayout>
        }
      />
      <Route
        path="/privacy"
        element={
          <PublicLayout>
            <PrivacyPage />
          </PublicLayout>
        }
      />
      <Route
        path="/guidelines"
        element={
          <PublicLayout>
            <GuidelinesPage />
          </PublicLayout>
        }
      />
      <Route
        path="/resources"
        element={
          <PublicLayout>
            <ResourcesPage />
          </PublicLayout>
        }
      />
      <Route
        path="/communities"
        element={
          <PublicLayout>
            <CommunitiesPage />
          </PublicLayout>
        }
      />
      <Route
        path="/communities/:id"
        element={
          <ProtectedRoute>
            <CommunityChatPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/posts"
        element={
          <AdminRoute>
            <AdminPostsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <AdminReportsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminCategoriesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/announcements"
        element={
          <AdminRoute>
            <AdminAnnouncementsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalyticsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/audit-log"
        element={
          <AdminRoute>
            <AdminAuditLogPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
