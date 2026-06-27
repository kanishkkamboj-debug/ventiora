import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { mockCategories } from '../utils/mockData';

export function CreatePostPage({ editMode }: { editMode?: boolean }) {
  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-on-surface mb-8">
          {editMode ? 'Edit post' : 'Create a post'}
        </h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <Input 
              label="Title" 
              placeholder="Give your post a title..." 
              className="text-lg font-medium"
            />
            
            <Textarea 
              label="Content" 
              placeholder="What's on your mind? No judgment here." 
              className="min-h-[200px] font-serif text-lg"
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Category</label>
              <select className="flex h-11 w-full rounded-xl border border-outline-variant bg-surface px-4 py-2 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container">
                <option value="" disabled selected>Select a category...</option>
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="bg-surface p-4 rounded-xl border border-outline-variant flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Post Anonymously</span>
                <span className="text-xs text-muted-text mt-1">
                  Other students won't see your name. Admins can still identify your account only if needed for moderation.
                </span>
              </div>
              <Switch />
            </div>
            
            <div className="pt-4 border-t border-outline-variant flex justify-end">
              <Button size="lg" className="w-full sm:w-auto">
                {editMode ? 'Save Changes' : 'Publish Post'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
