import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Avatar } from '../components/ui/Avatar';
import { mockUsers, mockPosts } from '../utils/mockData';
import { PostCard } from '../components/widgets/PostCard';
import { Settings, Award } from 'lucide-react';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  
  const user = mockUsers.find(u => u.username === username);
  const userPosts = mockPosts.filter(p => !p.author.isAnonymous && p.author.user.id === user?.id);
  
  const isCurrentUser = username === 'alex_campus'; // Mock current user logic
  
  if (!user) {
    return (
      <PageWrapper>
        <div className="text-center py-20 font-headline-md text-headline-md text-on-surface">User not found</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto w-full">
        {/* Profile Header Card */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 shadow-sm border border-border mb-8 relative">
          {isCurrentUser && (
            <button className="absolute top-6 right-6 font-label-md text-label-md border border-border rounded-full px-4 py-2 hover:bg-surface-container-low transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" /> Edit profile
            </button>
          )}
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="shrink-0">
              <Avatar avatarUrl={user?.avatar_url} username={user?.username} size="lg" className="h-16 w-16 text-2xl" />
            </div>
            <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-1">@{user.username}</h1>
              <p className="font-body-md text-body-md text-muted-text italic mb-2">{user.bio || 'No bio provided.'}</p>
              <div className="flex items-center justify-center sm:justify-start gap-4 font-label-sm text-label-sm text-muted-text mb-4">
                <span>Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                <span>•</span>
                <span>{userPosts.length} posts · 0 comments</span>
              </div>
            </div>
          </div>
          
          {/* Badge Row Mock */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-6 pt-6 border-t border-border">
             <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1.5">
               <Award className="w-3.5 h-3.5" /> Top Contributor
             </div>
             <span className="font-label-sm text-label-sm text-muted-text ml-2 italic">Badges coming soon</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-border mb-6">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`pb-3 font-label-md text-label-md font-bold transition-colors border-b-2 ${
              activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-muted-text hover:text-on-surface'
            }`}
          >
            Posts
          </button>
          <button 
            onClick={() => setActiveTab('comments')}
            className={`pb-3 font-label-md text-label-md font-bold transition-colors border-b-2 ${
              activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-muted-text hover:text-on-surface'
            }`}
          >
            Comments
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6">
          {activeTab === 'posts' && (
            userPosts.length > 0 ? (
              userPosts.map(post => <PostCard key={post.id} post={post} compact />)
            ) : (
              <div className="text-center py-12 bg-surface rounded-xl border border-border border-dashed">
                <p className="font-body-md text-body-md text-muted-text">No public posts yet.</p>
              </div>
            )
          )}
          {activeTab === 'comments' && (
             <div className="text-center py-12 bg-surface rounded-xl border border-border border-dashed">
                <p className="font-body-md text-body-md text-muted-text">No public comments yet.</p>
              </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
