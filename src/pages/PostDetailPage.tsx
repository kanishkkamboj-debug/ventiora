import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { mockPosts, mockComments } from '../utils/mockData';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { formatDistanceToNow } from '../utils/date';
import { Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find(p => p.id === id);
  const comments = mockComments.filter(c => c.post_id === id);

  if (!post) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Link to="/" className="text-primary-container hover:underline">Return to Home</Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-text hover:text-on-surface mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to feed
      </Link>
      
      <article className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar 
            user={{ username: post.author_username } as any} 
            isAnonymous={post.is_anonymous} 
            size="md" 
          />
          <div className="flex flex-col">
            <span className="font-bold text-on-surface">
              {post.is_anonymous ? 'Anonymous' : `@${post.author_username}`}
            </span>
            <span className="text-sm text-muted-text">{formatDistanceToNow(new Date(post.created_at))}</span>
          </div>
        </div>
        
        <Badge variant="secondary" className="mb-4">
          <span>{post.category_emoji}</span> {post.category_name}
        </Badge>
        
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-4">{post.title}</h1>
        <p className="text-on-surface text-lg leading-relaxed font-serif whitespace-pre-wrap">
          {post.content}
        </p>
        
        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-outline-variant">
          <button className="flex items-center gap-2 text-muted-text hover:text-error transition-colors">
            <Heart className="h-5 w-5" />
            <span className="font-semibold">12</span>
          </button>
          <div className="flex items-center gap-2 text-muted-text">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">{comments.length} Comments</span>
          </div>
        </div>
      </article>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant">
        <h3 className="font-bold text-lg mb-4">Add a Comment</h3>
        <div className="flex gap-4 mb-8">
          <Avatar user={{ username: 'currentUser' } as any} size="sm" />
          <div className="flex-1 flex flex-col gap-3">
            <Textarea placeholder="What are your thoughts?" className="min-h-[80px]" />
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-muted-text">
                <input type="checkbox" className="rounded border-outline-variant text-primary-container focus:ring-primary-container" />
                Comment anonymously
              </label>
              <Button size="sm">Post Comment</Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-4">
              <Avatar 
                user={{ username: comment.author_username } as any} 
                isAnonymous={comment.is_anonymous} 
                size="sm" 
              />
              <div className="flex-1">
                <div className="bg-surface rounded-2xl rounded-tl-none p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">
                      {comment.is_anonymous ? 'Anonymous' : `@${comment.author_username}`}
                    </span>
                    <span className="text-xs text-muted-text">• {formatDistanceToNow(new Date(comment.created_at))}</span>
                  </div>
                  <p className="text-sm font-serif">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
