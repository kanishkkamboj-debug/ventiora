import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { mockPosts, mockComments } from '../utils/mockData';
import { Avatar } from '../components/ui/Avatar';
import { formatDistanceToNow } from '../utils/date';
import { ThumbsUp, MessageCircle, ArrowLeft, Bookmark, UserX, User, Pin, Star, MoreHorizontal, Send } from 'lucide-react';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find(p => p.id === id);
  const comments = mockComments.filter(c => c.post_id === id);

  if (!post) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Link to="/" className="text-primary hover:underline">Return to Home</Link>
        </div>
      </PageWrapper>
    );
  }

  // Strict anonymity check
  const isAnonymous = post.is_anonymous === true;
  const displayName = isAnonymous ? 'Anonymous' : `@${post.author_username}`;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2 font-label-md text-label-md text-muted-text hover:text-on-surface mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to feed
        </Link>
        
        {/* Main Post Card */}
        <article className="bg-surface rounded-xl p-6 sm:p-8 shadow-sm border border-border mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              {isAnonymous ? (
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <UserX className="w-5 h-5" />
                </div>
              ) : (
                <div className="shrink-0 w-10 h-10">
                  <Avatar user={{ username: post.author_username } as any} size="sm" />
                </div>
              )}
              
              <div className="flex flex-col">
                <span className={`font-label-md text-label-md font-semibold ${isAnonymous ? 'text-muted-text' : 'text-primary'}`}>
                  {displayName}
                </span>
                <span className="font-label-sm text-label-sm text-muted-text">
                  {formatDistanceToNow(new Date(post.created_at))} • {post.category_name} {post.category_emoji}
                </span>
              </div>
            </div>
            
            <button className="text-muted-text hover:bg-surface-container-low p-2 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-background mb-6 flex items-center gap-3">
            {post.is_pinned && <Pin className="h-6 w-6 text-primary shrink-0" />}
            {post.is_featured && <Star className="h-6 w-6 text-secondary shrink-0" />}
            {post.title}
          </h1>
          
          <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap mb-8">
            {post.content}
          </div>
          
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border font-label-md text-label-md text-muted-text">
            <button className="flex items-center gap-2 hover:text-primary transition-colors group">
              <ThumbsUp className="w-5 h-5 group-hover:fill-primary" />
              <span>12 Likes</span>
            </button>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length} Comments</span>
            </div>
            <button className="flex items-center gap-2 hover:text-primary transition-colors ml-auto group">
              <Bookmark className="w-5 h-5 group-hover:fill-primary" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-surface rounded-xl p-6 sm:p-8 shadow-sm border border-border">
          <h3 className="font-headline-md text-headline-md font-bold mb-6">Discussion</h3>
          
          <div className="flex gap-4 mb-10">
            <div className="shrink-0 w-10 h-10 hidden sm:block">
              <Avatar user={{ username: 'currentUser' } as any} size="sm" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <textarea 
                placeholder="What are your thoughts?" 
                className="w-full min-h-[100px] bg-surface-container-low border border-border rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-y"
              />
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 font-label-sm text-label-sm text-muted-text cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-border rounded flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="group-hover:text-on-surface transition-colors">Comment anonymously</span>
                </label>
                <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full hover:shadow-[0_4px_12px_rgba(var(--primary),0.25)] transition-all active:scale-95 flex items-center gap-2">
                  <Send className="w-4 h-4" /> Post
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {comments.map(comment => {
              const isCommentAnonymous = comment.is_anonymous === true;
              return (
                <div key={comment.id} className="flex gap-4 group">
                  <div className="shrink-0 w-8 h-8">
                    {isCommentAnonymous ? (
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <UserX className="w-4 h-4" />
                      </div>
                    ) : (
                      <Avatar user={{ username: comment.author_username } as any} size="sm" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="bg-surface-container-low rounded-2xl rounded-tl-none p-4 border border-border">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-label-sm text-label-sm font-semibold ${isCommentAnonymous ? 'text-muted-text' : 'text-on-surface'}`}>
                            {isCommentAnonymous ? 'Anonymous' : `@${comment.author_username}`}
                          </span>
                          <span className="text-muted-text text-xs">•</span>
                          <span className="font-label-sm text-label-sm text-muted-text">
                            {formatDistanceToNow(new Date(comment.created_at))}
                          </span>
                        </div>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 ml-2">
                      <button className="flex items-center gap-1.5 font-label-sm text-label-sm text-muted-text hover:text-primary transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" /> 2
                      </button>
                      <button className="font-label-sm text-label-sm text-muted-text hover:text-primary transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
