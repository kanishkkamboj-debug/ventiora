import React, { useState } from 'react';
import type { Category } from '../../types/category.types';
import { Switch } from '../common/Switch';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { cn } from '../../utils/cn';

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [newEmoji, setNewEmoji] = useState('');
  const [newName, setNewName] = useState('');

  const toggleActive = (id: string) => {
    setCategories((cats) =>
      cats.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    );
  };

  const addCategory = () => {
    if (!newName.trim()) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newName.trim(),
      emoji: newEmoji.trim() || '📁',
      slug: newName.trim().toLowerCase().replace(/\s+/g, '-'),
      postCount: 0,
      isActive: true,
    };
    setCategories((cats) => [...cats, newCat]);
    setNewEmoji('');
    setNewName('');
  };

  return (
    <div className="space-y-5">
      {/* Add new */}
      <div className="bg-surface-container rounded-xl p-4">
        <h3 className="text-sm font-bold text-on-surface mb-3">Add New Category</h3>
        <div className="flex gap-3 items-end">
          <div className="w-20">
            <Input
              label="Emoji"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              placeholder="📚"
            />
          </div>
          <div className="flex-1">
            <Input
              label="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
            />
          </div>
          <Button onClick={addCategory} disabled={!newName.trim()}>
            Add
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-xs font-semibold text-muted-text uppercase tracking-wider">
              <th className="text-left py-3 px-4">Emoji</th>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Post Count</th>
              <th className="text-left py-3 px-4">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {categories.map((cat, idx) => (
              <tr
                key={cat.id}
                className={cn(
                  'hover:bg-surface-container transition-colors',
                  idx % 2 !== 0 && 'bg-surface-container-low',
                )}
              >
                <td className="py-3 px-4 text-xl">{cat.emoji}</td>
                <td className="py-3 px-4 font-medium text-on-surface">{cat.name}</td>
                <td className="py-3 px-4 text-on-surface-variant">{cat.postCount}</td>
                <td className="py-3 px-4">
                  <Switch
                    checked={cat.isActive}
                    onChange={() => toggleActive(cat.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
