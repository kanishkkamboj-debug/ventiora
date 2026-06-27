import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Search } from 'lucide-react';
import { PostCard } from '../components/widgets/PostCard';
import { CategoryFilterBar } from '../components/widgets/CategoryFilterBar';
import { mockPosts } from '../utils/mockData';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  
  const results = mockPosts.filter(post => {
    const matchesCategory = selectedCategory ? post.category_id === selectedCategory : true;
    const matchesQuery = query ? post.title.toLowerCase().includes(query.toLowerCase()) || post.content.toLowerCase().includes(query.toLowerCase()) : true;
    return matchesCategory && matchesQuery;
  });

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-lg border border-outline-variant shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>
        
        <div className="mb-6">
          <CategoryFilterBar 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>

        <p className="text-muted-text text-sm mb-4">
          {results.length} result{results.length !== 1 ? 's' : ''} {query && `for "${query}"`}
        </p>

        <div className="flex flex-col gap-4">
          {results.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {results.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-outline-variant border-dashed">
              <p className="text-muted-text mb-2">No posts match your search.</p>
              <p className="text-sm text-muted-text">Try different keywords or browse by category.</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
