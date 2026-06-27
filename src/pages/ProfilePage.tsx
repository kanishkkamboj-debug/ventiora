import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../ui/Button';
import { mockUsers, mockPosts } from '../utils/mockData';
import { PostCard } from '../components/widgets/PostCard';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  
  const user = mockUsers.find(u => u.username === username);
  const userPosts = mockPosts.filter(p => p.user_id === user?.id && !p.is_anonymous);
  
  if (!user) {
    return (
      <PageWrapper>
        <div className="text-center py-20">User not found</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-outline-variant mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar user={user} size="lg" className="h-24 w-24 text-3xl" />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-on-surface mb-1">@{user.username}</h1>
              <p className="text-muted-text text-sm mb-4">Joined {new Date(user.created_at).toLocaleDateString()}</p>
              <p className="text-on-surface font-serif mb-4">{user.bio || 'No bio provided.'}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface">
                  {userPosts.length} Public Posts
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 border-b border-outline-variant mb-6">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'posts' ? 'border-primary-container text-primary-container' : 'border-transparent text-muted-text hover:text-on-surface'
            }`}
          >
            Posts
          </button>
          <button 
            onClick={() => setActiveTab('comments')}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === 'comments' ? 'border-primary-container text-primary-container' : 'border-transparent text-muted-text hover:text-on-surface'
            }`}
          >
            Comments
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {activeTab === 'posts' && (
            userPosts.length > 0 ? (
              userPosts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-center text-muted-text py-12">No public posts yet.</p>
            )
          )}
          {activeTab === 'comments' && (
             <p className="text-center text-muted-text py-12">No public comments yet.</p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
