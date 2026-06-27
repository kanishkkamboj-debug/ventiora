import React from 'react';
import { cn } from '../../utils/cn';

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

interface DashboardStatsProps {
  stats: StatCard[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-text uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-on-surface mt-1">{stat.value}</p>
            </div>
            <span className="text-2xl">{stat.icon}</span>
          </div>
          {stat.trend && (
            <p className={cn('text-xs mt-2', stat.trendUp ? 'text-green-600' : 'text-error')}>
              {stat.trendUp ? '▲' : '▼'} {stat.trend}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
