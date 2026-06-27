import React from 'react';
import type { Category } from '../../types/category.types';
import { Select } from '../common/Select';

interface CategorySelectProps {
  categories: Category[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function CategorySelect({ categories, value, onChange, error, required }: CategorySelectProps) {
  return (
    <Select
      label="Category"
      required={required}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      placeholder="Choose a category…"
      options={categories.map((c) => ({
        value: c.id,
        label: `${c.emoji} ${c.name}`,
      }))}
    />
  );
}
