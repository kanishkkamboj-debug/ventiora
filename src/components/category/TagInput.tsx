import React, { useState } from 'react';
import type { Tag } from '../../types/category.types';
import { cn } from '../../utils/cn';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: Tag[];
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({ value, onChange, suggestions = [], placeholder = 'Add tags…', maxTags = 5 }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-on-surface mb-1 block">
        Tags <span className="text-muted-text font-normal">(up to {maxTags})</span>
      </label>
      <div className="min-h-[42px] flex flex-wrap gap-1.5 items-center border border-outline-variant rounded-md px-3 py-2 bg-surface-container-lowest focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-colors">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-on-primary-container text-primary text-xs font-medium"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-error transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        {value.length < maxTags && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[80px] text-sm bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant/50"
          />
        )}
      </div>
      {suggestions.length > 0 && input && (
        <div className="mt-1 flex flex-wrap gap-1">
          {suggestions
            .filter((s) => s.name.includes(input) && !value.includes(s.name))
            .slice(0, 5)
            .map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => addTag(s.name)}
                className="text-xs px-2 py-0.5 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
              >
                #{s.name}
              </button>
            ))}
        </div>
      )}
      <p className="text-xs text-muted-text mt-1">Press Enter or comma to add a tag</p>
    </div>
  );
}
