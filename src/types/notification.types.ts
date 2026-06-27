export type NotificationType =
  | 'COMMENT_ON_POST'
  | 'REPLY_TO_COMMENT'
  | 'REACTION_ON_POST'
  | 'REACTION_ON_COMMENT'
  | 'POST_PINNED'
  | 'POST_FEATURED'
  | 'ACCOUNT_WARNING'
  | 'ANNOUNCEMENT';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  targetType?: 'POST' | 'COMMENT';
  targetId?: string;
  actorUsername?: string;
  createdAt: string;
}
