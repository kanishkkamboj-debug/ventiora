import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Search, X } from 'lucide-react';
import { PostCard } from '../components/widgets/PostCard';
import { CategoryFilterBar } from '../components/widgets/CategoryFilterBar';
import { mockPosts } from '../utils/mockData';
import { Link } from 'react-router-dom';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  
  const results = mockPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || !selectedCategory ? true : post.category.id === selectedCategory;
    const matchesQuery = query ? post.title.toLowerCase().includes(query.toLowerCase()) || post.content.toLowerCase().includes(query.toLowerCase()) : true;
    return matchesCategory && matchesQuery;
  });

  return (
    <PageWrapper>
      <div className="w-full mb-8">
        <div className="relative mb-6 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text h-6 w-6" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search discussions, tags, or topics..."
            className="w-full pl-14 pr-12 py-4 bg-surface-container-lowest border border-border rounded-full text-headline-md font-headline-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all shadow-sm"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-text hover:text-on-surface p-1 rounded-full hover:bg-surface-container-low transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="mb-6">
          <CategoryFilterBar 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>

        <p className="text-muted-text font-label-md text-label-md mb-6">
          {results.length} result{results.length !== 1 ? 's' : ''} {query && `for "${query}"`}
        </p>

        <div className="flex flex-col gap-6">
          {results.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {results.length === 0 && (
            <div className="text-center py-20 bg-surface rounded-xl border border-border border-dashed flex flex-col items-center">
              <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center text-muted-text mb-4">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-on-surface font-headline-md text-headline-md mb-2">No posts match your search.</p>
              <p className="font-body-md text-body-md text-muted-text mb-6">Try different keywords or browse by category instead.</p>
              <Link to="/" className="text-primary font-label-md text-label-md font-bold hover:underline flex items-center gap-1">
                Browse all categories <span>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
