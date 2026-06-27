export interface Announcement {
  id: string;
  title: string;
  body: string;
  isHighlighted: boolean;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  createdByUsername: string;
}
