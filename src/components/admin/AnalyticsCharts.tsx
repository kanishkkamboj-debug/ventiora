import React from 'react';
import { mockCategories, mockPosts } from '../../utils/mockData';

function BarChart({ label, value, max, color = 'bg-primary' }: { label: string; value: number; max: number; color?: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-on-surface-variant w-24 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-surface-container rounded-full h-3">
        <div className={`${color} h-3 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-on-surface w-10 text-right">{value}</span>
    </div>
  );
}

export function AnalyticsCharts() {
  const maxPosts = Math.max(...mockCategories.map((c) => c.postCount));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Growth placeholder */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
        <h3 className="text-sm font-bold text-on-surface mb-1">User Growth</h3>
        <p className="text-xs text-muted-text mb-4">Monthly new registrations</p>
        <div className="flex items-end gap-2 h-36">
          {[12, 18, 24, 31, 28, 40, 55, 47, 62, 70, 65, 80].map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/70 rounded-t transition-all"
              style={{ height: `${(v / 80) * 100}%` }}
              title={`Month ${i + 1}: ${v} users`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-text mt-2">
          <span>Jan</span><span>Jun</span><span>Dec</span>
        </div>
        <p className="text-xs text-muted-text mt-3 text-center">
          Chart will render here — wire Recharts in Step 7
        </p>
      </div>

      {/* Category Popularity */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
        <h3 className="text-sm font-bold text-on-surface mb-1">Category Popularity</h3>
        <p className="text-xs text-muted-text mb-4">Post count by category</p>
        <div className="space-y-3">
          {mockCategories.map((cat) => (
            <BarChart
              key={cat.id}
              label={`${cat.emoji} ${cat.name}`}
              value={cat.postCount}
              max={maxPosts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
