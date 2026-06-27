import React from 'react';
import { CategoryManager } from '../../components/admin/CategoryManager';
import { mockCategories } from '../../utils/mockData';

export function AdminCategoriesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Categories</h1>
        <p className="text-sm text-muted-text mt-1">Manage forum categories</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
        <CategoryManager categories={mockCategories} />
      </div>
    </div>
  );
}
