import React from 'react';
import type { Category } from '../../types/category.types';
import { cn } from '../../utils/cn';

interface CategoryChipProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ category, isActive, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border',
        isActive
          ? 'bg-primary text-on-primary border-primary'
          : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary',
      )}
    >
      <span>{category.emoji}</span>
      <span>{category.name}</span>
    </button>
  );
}
