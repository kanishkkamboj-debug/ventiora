import type { TargetType } from './common.types';

export type AuditAction =
  | 'USER_BANNED'
  | 'USER_SUSPENDED'
  | 'USER_UNSUSPENDED'
  | 'USER_UNBANNED'
  | 'POST_DELETED'
  | 'POST_PINNED'
  | 'POST_UNPINNED'
  | 'POST_FEATURED'
  | 'POST_UNFEATURED'
  | 'POST_LOCKED'
  | 'COMMENT_DELETED'
  | 'REPORT_ACCEPTED'
  | 'REPORT_REJECTED'
  | 'CATEGORY_CREATED'
  | 'CATEGORY_UPDATED'
  | 'ANNOUNCEMENT_CREATED'
  | 'ANNOUNCEMENT_DELETED';

export interface AuditLog {
  id: string;
  adminUsername: string;
  action: AuditAction;
  targetType: TargetType | 'USER' | 'CATEGORY' | 'ANNOUNCEMENT' | 'REPORT';
  targetId: string;
  note?: string;
  createdAt: string;
}
