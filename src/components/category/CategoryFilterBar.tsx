import React from 'react';
import type { Category } from '../../types/category.types';
import { CategoryChip } from './CategoryChip';

interface CategoryFilterBarProps {
  categories: Category[];
  activeId?: string;
  onSelect: (id: string | undefined) => void;
}

export function CategoryFilterBar({ categories, activeId, onSelect }: CategoryFilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSelect(undefined)}
        className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
          !activeId
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <CategoryChip
          key={cat.id}
          category={cat}
          isActive={activeId === cat.id}
          onClick={() => onSelect(activeId === cat.id ? undefined : cat.id)}
        />
      ))}
    </div>
  );
}
