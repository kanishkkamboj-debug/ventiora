/**
 * src/api/index.ts
 *
 * Barrel export for the data-access layer.
 * Import all API functions from here rather than from individual files:
 *
 *   import { getPosts, createPost } from '@/api';
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NOT-YET-WIRED (Phase 5+ TODO list)
 *
 * The functions below exist and are tested, but the pages/components that
 * should call them still import from `mockData.ts` directly.
 * Each entry will be cleared when its corresponding prompt lands.
 *
 * | File / Component                | Still uses mockData for  | Prompt |
 * |----------------------------------|-----------------------------|--------|
 * | pages/HomePage.tsx              | mockPosts                   | P-08   |
 * | pages/PostDetailPage.tsx        | mockPosts, mockComments     | P-09   |
 * | pages/CreatePostPage.tsx        | mockCategories              | P-10   |
 * | pages/SearchPage.tsx            | mockPosts                   | P-11   |
 * | pages/ProfilePage.tsx           | mockUsers, mockPosts        | P-12   |
 * | pages/NotificationsPage.tsx     | mockNotifications           | P-13   |
 * | pages/MessagesPage.tsx          | (direct mock, no API yet)  | P-14   |
 * | pages/CommunityChatPage.tsx     | mockUsers                   | P-14   |
 * | components/widgets/PostCard.tsx | (reactions via mockData)    | P-08   |
 * | components/layout/Sidebar.tsx   | mockCategories, mockPosts   | P-08   |
 * | components/widgets/CategoryFilterBar.tsx | mockCategories      | P-08   |
 * | components/layout/Navbar.tsx    | mockNotifications           | P-13   |
 * | components/report/ReportModal.tsx | mockReports               | P-17   |
 * | components/user/UserHistoryTabs.tsx | mockPosts, mockComments | P-12   |
 * | context/AuthContext.tsx         | mockUsers                   | P-16   |
 * | pages/admin/AdminUsersPage.tsx  | mockUsers                   | P-18   |
 * | pages/admin/AdminPostsPage.tsx  | mockPosts                   | P-18   |
 * | components/admin/AnalyticsCharts.tsx | mockCategories, mockPosts | P-18 |
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Auth
export * from './auth.api';

// Posts
export * from './posts.api';

// Comments
export * from './comments.api';

// Reactions
export * from './reactions.api';

// Reports
export * from './reports.api';

// Notifications
export * from './notifications.api';

// Users
export * from './users.api';
