import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { CategoryFilterBar } from '../components/widgets/CategoryFilterBar';
import { PostCard } from '../components/widgets/PostCard';
import { mockPosts } from '../utils/mockData';

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const navigate = useNavigate();
  
  const filteredPosts = selectedCategory 
    ? mockPosts.filter(p => p.category.id === selectedCategory)
    : mockPosts;

  return (
    <PageWrapper showTrending>
      {/* Feed Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-stack-lg">
        <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-background">
          Latest Discussions
        </h1>
        <button 
          onClick={() => navigate('/posts/new')}
          className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:shadow-[0_4px_12px_rgba(var(--primary),0.25)] transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Post
        </button>
      </div>

      <div className="mb-6">
        <CategoryFilterBar 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>

      {/* Post List */}
      <div className="space-y-stack-md">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 bg-surface rounded-xl border border-border border-dashed">
            <p className="text-muted-text mb-4 font-body-md text-body-md">No posts found in this category.</p>
            <button 
              onClick={() => setSelectedCategory(undefined)} 
              className="text-primary font-label-md text-label-md hover:underline"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
