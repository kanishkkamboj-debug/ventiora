import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { CategoryFilterBar } from '../components/widgets/CategoryFilterBar';
import { PostCard } from '../components/widgets/PostCard';
import { mockPosts } from '../utils/mockData';
import { Button } from '../components/ui/Button';

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  
  const filteredPosts = selectedCategory 
    ? mockPosts.filter(p => p.category_id === selectedCategory)
    : mockPosts;

  return (
    <PageWrapper showTrending>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface mb-4">Your Campus Feed</h1>
        <CategoryFilterBar 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>

      <div className="flex flex-col gap-4">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant border-dashed">
            <p className="text-muted-text mb-4">No posts found in this category.</p>
            <Button onClick={() => setSelectedCategory(undefined)} variant="outline">
              Clear Filter
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
