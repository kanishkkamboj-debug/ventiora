import type { TargetType } from './common.types';
import type { User } from './user.types';

export type ReportReason =
  | 'SPAM'
  | 'HARASSMENT'
  | 'MISINFORMATION'
  | 'INAPPROPRIATE_CONTENT'
  | 'SELF_HARM_CONCERN'
  | 'OTHER';

export type ReportStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Report {
  id: string;
  targetType: TargetType;
  targetId: string;
  targetPreview: string;
  reason: ReportReason;
  description?: string;
  reporter: User;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: User;
}

export interface CreateReportRequest {
  targetType: TargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
}
