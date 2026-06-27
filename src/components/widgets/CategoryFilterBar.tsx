import React from 'react';
import { mockCategories } from '../../utils/mockData';
import { cn } from '../ui/Button';

interface CategoryFilterBarProps {
  selectedCategory?: string;
  onSelectCategory?: (id: string | undefined) => void;
}

export function CategoryFilterBar({ selectedCategory, onSelectCategory }: CategoryFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 pt-2 hide-scrollbar">
      <button
        onClick={() => onSelectCategory?.(undefined)}
        className={cn(
          "shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors border",
          !selectedCategory
            ? "bg-primary-container text-on-primary-container border-primary-container"
            : "bg-surface text-on-surface border-outline-variant hover:bg-surface-container"
        )}
      >
        All Posts
      </button>
      
      {mockCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory?.(cat.id)}
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
            selectedCategory === cat.id
              ? "bg-secondary-container text-on-secondary-container border-secondary-container"
              : "bg-surface text-on-surface border-outline-variant hover:bg-surface-container"
          )}
        >
          <span>{cat.emoji}</span>
          {cat.name}
        </button>
      ))}
    </div>
  );
}
