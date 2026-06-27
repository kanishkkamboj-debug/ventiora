import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { mockCategories } from '../utils/mockData';
import { Upload, X } from 'lucide-react';

export function CreatePostPage({ editMode }: { editMode?: boolean }) {
  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="font-headline-xl text-headline-xl text-on-background mb-8 text-center sm:text-left">
          {editMode ? 'Edit post' : 'Create a post'}
        </h1>
        
        <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Title</label>
              <input 
                type="text"
                placeholder="Give your post a title..." 
                className="w-full bg-surface-container-low border border-border rounded-xl px-4 py-3 font-headline-md text-headline-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:font-body-md placeholder:text-muted-text"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md font-semibold text-on-surface">Content</label>
                {/* Markdown Toolbar Mockup */}
                <div className="flex gap-2">
                  <button type="button" className="p-1.5 text-muted-text hover:bg-surface-container-low rounded-md transition-colors"><span className="font-serif font-bold text-sm px-1">B</span></button>
                  <button type="button" className="p-1.5 text-muted-text hover:bg-surface-container-low rounded-md transition-colors"><span className="font-serif italic text-sm px-1">I</span></button>
                </div>
              </div>
              <textarea 
                placeholder="What's on your mind? No judgment here." 
                className="w-full min-h-[200px] bg-surface-container-low border border-border rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-y placeholder:italic placeholder:text-muted-text"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Category</label>
              <div className="relative">
                <select className="w-full bg-surface-container-low border border-border rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all appearance-none">
                  <option value="" disabled selected>Select a category...</option>
                  {mockCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-text">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/0.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-muted-text group-hover:text-primary transition-colors mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-label-md text-label-md font-semibold text-on-surface mb-1">Drag & drop an image</p>
              <p className="font-label-sm text-label-sm text-muted-text">or click to browse</p>
            </div>
            
            <div className="bg-surface-container-low p-4 rounded-xl border border-border flex items-center justify-between">
              <div className="flex flex-col max-w-[80%]">
                <span className="font-label-md text-label-md font-semibold text-on-surface">Post Anonymously</span>
                <span className="font-label-sm text-label-sm text-muted-text mt-1">
                  Other students won't see your name. Admins can still identify your account only if needed for moderation.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="pt-6 border-t border-border flex justify-end">
              <button 
                type="submit"
                className="w-full sm:w-auto bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-full hover:shadow-[0_4px_12px_rgba(var(--primary),0.25)] transition-all active:scale-95"
              >
                {editMode ? 'Save Changes' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
