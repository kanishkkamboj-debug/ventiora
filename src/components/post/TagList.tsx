import React from 'react';
import type { Tag } from '../../types/category.types';

interface TagListProps {
  tags: Tag[];
}

export function TagList({ tags }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant"
        >
          #{tag.name}
        </span>
      ))}
    </div>
  );
}
