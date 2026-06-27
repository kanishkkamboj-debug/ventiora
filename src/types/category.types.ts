export interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
  postCount: number;
  isActive: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}
