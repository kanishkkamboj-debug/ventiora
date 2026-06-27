import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const trendingTopics = [
  {
    id: '1',
    rank: 1,
    category: 'Campus News',
    title: 'Library extending hours for finals week starting Monday',
    views: '1.2k',
  },
  {
    id: '2',
    rank: 2,
    category: 'Career',
    title: 'Summer 2025 Internship Megathread',
    views: '856',
  },
  {
    id: '3',
    rank: 3,
    category: 'Events',
    title: 'Free pizza at the student union today at 1pm!',
    views: '540',
  },
];

export function TrendingRail() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 sticky top-24 shadow-sm dark:shadow-none">
      <h3 className="font-headline-md text-headline-md text-on-background mb-4 flex items-center gap-2">
        <TrendingUp className="text-primary w-5 h-5" /> Trending Topics
      </h3>
      <div className="space-y-4">
        {trendingTopics.map((topic, index) => (
          <React.Fragment key={topic.id}>
            <Link to={`/search?q=${topic.category}`} className="block group">
              <div className="font-label-sm text-label-sm text-muted-text mb-1">
                {topic.rank} • {topic.category}
              </div>
              <div className="font-label-md text-label-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                {topic.title}
              </div>
              <div className="font-label-sm text-label-sm text-muted-text mt-1">
                {topic.views} views
              </div>
            </Link>
            {index !== trendingTopics.length - 1 && <hr className="border-border" />}
          </React.Fragment>
        ))}
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
