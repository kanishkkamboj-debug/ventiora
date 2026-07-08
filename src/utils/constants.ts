export const APP_NAME = 'Ventiora';
export const CONTAINER_MAX = '1120px';
export const PAGE_SIZE = 10;

export const SORT_LABELS = {
  TRENDING: 'Trending',
  NEW: 'New',
  TOP: 'Top',
} as const;

export const REPORT_REASON_LABELS: Record<string, string> = {
  SPAM: 'Spam',
  HARASSMENT: 'Harassment',
  MISINFORMATION: 'Misinformation',
  INAPPROPRIATE_CONTENT: 'Inappropriate Content',
  SELF_HARM_CONCERN: 'âš ï¸ Self-Harm Concern',
  OTHER: 'Other',
};

export const ROLE_LABELS: Record<string, string> = {
  STUDENT: 'Student',
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
};

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  BANNED: 'Banned',
  SUSPENDED: 'Suspended',
};

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  USER_BANNED: 'User Banned',
  USER_SUSPENDED: 'User Suspended',
  USER_UNSUSPENDED: 'User Unsuspended',
  USER_UNBANNED: 'User Unbanned',
  POST_DELETED: 'Post Deleted',
  POST_PINNED: 'Post Pinned',
  POST_UNPINNED: 'Post Unpinned',
  POST_FEATURED: 'Post Featured',
  POST_UNFEATURED: 'Post Unfeatured',
  POST_LOCKED: 'Post Locked',
  COMMENT_DELETED: 'Comment Deleted',
  REPORT_ACCEPTED: 'Report Accepted',
  REPORT_REJECTED: 'Report Rejected',
  CATEGORY_CREATED: 'Category Created',
  CATEGORY_UPDATED: 'Category Updated',
  ANNOUNCEMENT_CREATED: 'Announcement Created',
  ANNOUNCEMENT_DELETED: 'Announcement Deleted',
};
