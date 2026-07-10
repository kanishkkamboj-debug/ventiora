import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { mockPosts, mockComments } from '../utils/mockData';
import { Avatar } from '../components/ui/Avatar';
import { CommentItem } from '../components/comment/CommentItem';
import { CommentForm } from '../components/comment/CommentForm';
import { formatTimeAgo, formatFull, toISOString } from '../utils/date';
import { ArrowLeft, MessageCircle, ThumbsUp, Bookmark, Pin, Star, MoreHorizontal, Send, UserX } from 'lucide-react';
import { ReportButton } from '../components/report/ReportButton';
import { useAuth } from '../hooks/useAuth';
import { resolveDisplayName, resolveUsername } from '../utils/anonymity';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  const post = mockPosts.find(p => p.id === id);
  const postComments = mockComments.filter(c => c.postId === id);
  
  if (!post) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-on-surface">Post not found</h2>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Return home
          </Link>
        </div>
      </PageWrapper>
    );
  }

  // Single top-level flag — never read from post.author.isAnonymous
  const isAnonymous = post.isAnonymous;
  const displayName = resolveDisplayName(isAnonymous, post.author);
  
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-on-surface mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>
        
        <article className="bg-surface rounded-xl p-6 sm:p-8 shadow-sm border border-border mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              {isAnonymous ? (
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <UserX className="w-5 h-5" />
                </div>
              ) : (
                <div className="shrink-0 w-10 h-10">
                  <Avatar username={resolveUsername(isAnonymous, post.author)} size="md" />
                </div>
              )}
              
              <div className="flex flex-col">
                <span className={`font-label-md text-label-md font-semibold ${isAnonymous ? 'text-muted-text' : 'text-primary'}`}>
                  {displayName}
                </span>
                <time
                  dateTime={toISOString(post.createdAt)}
                  title={formatFull(post.createdAt)}
                  className="font-label-sm text-label-sm text-muted-text"
                >
                  {formatTimeAgo(post.createdAt)} • {post.category.name} {post.category.emoji}
                </time>
              </div>
            </div>
            
            <button className="text-muted-text hover:bg-surface-container-low p-2 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-background mb-6 flex items-center gap-3">
            {post.isPinned && <Pin className="h-6 w-6 text-primary shrink-0" />}
            {post.isFeatured && <Star className="h-6 w-6 text-secondary shrink-0" />}
            {post.title}
          </h1>
          
          <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap mb-8">
            {post.content}
          </div>
          
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border font-label-md text-label-md text-muted-text">
            <button className="flex items-center gap-2 hover:text-primary transition-colors group">
              <ThumbsUp className="w-5 h-5 group-hover:fill-primary" />
              <span>{post.reactions[0]?.count || 0} Likes</span>
            </button>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentCount} Comments</span>
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
              <Avatar username={user?.username} size="sm" />
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
            {postComments.map(comment => (
              <CommentItem key={comment.id} comment={comment} level={0} />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
