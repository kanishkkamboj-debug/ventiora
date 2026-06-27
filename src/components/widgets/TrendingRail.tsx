import React from 'react';
import { Flame, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TrendingRail() {
  const trendingTopics = [
    { title: 'Finals survival guide', views: '2.4k', icon: Flame, color: 'text-error' },
    { title: 'Amazon OA results', views: '1.8k', icon: TrendingUp, color: 'text-primary-container' },
    { title: 'Cafeteria hacks', views: '956', icon: Clock, color: 'text-muted-text' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-6 sticky top-24">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary-container" />
        Trending Now
      </h3>
      <div className="space-y-4">
        {trendingTopics.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <Link key={i} to="/search" className="block group">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${topic.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-on-surface group-hover:text-primary-container transition-colors text-sm">
                    {topic.title}
                  </p>
                  <p className="text-xs text-muted-text mt-0.5">{topic.views} views</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-8">
        <h3 className="font-bold text-sm text-muted-text uppercase tracking-wider mb-4">
          Guidelines
        </h3>
        <ul className="text-sm text-muted-text space-y-2">
          <li>1. Be respectful to others.</li>
          <li>2. No hate speech or bullying.</li>
          <li>3. Keep anonymity responsible.</li>
        </ul>
      </div>
    </div>
  );
}
