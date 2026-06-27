export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
}

export type TargetType = 'POST' | 'COMMENT';

export type Role = 'STUDENT' | 'ADMIN' | 'MODERATOR';
