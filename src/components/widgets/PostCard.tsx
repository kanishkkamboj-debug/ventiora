import React from 'react';
import { ThumbsUp, MessageCircle, Bookmark, UserX, User, Pin, Star, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { formatDistanceToNow } from '../../utils/date';

interface PostCardProps {
  post: any; // Type to be refined
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  // STRICT ANONYMITY LOGIC
  // If a post is anonymous, NEVER display the real username.
  const isAnonymous = post.is_anonymous === true;
  const displayName = isAnonymous ? 'Anonymous' : `@${post.author_username}`;

  return (
    <article className="bg-surface rounded-xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none transition-all border border-transparent hover:border-border group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {isAnonymous ? (
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
              <UserX className="w-4 h-4" />
            </div>
          ) : (
            <div className="shrink-0">
              <Avatar user={{ username: post.author_username } as any} size="sm" />
            </div>
          )}
          
          <div className="flex flex-col">
            <span className={`font-label-sm text-label-sm font-semibold ${isAnonymous ? 'text-muted-text' : 'text-primary'}`}>
              {displayName}
            </span>
            <span className="font-label-sm text-label-sm text-muted-text">
              {formatDistanceToNow(new Date(post.created_at))} • {post.category_name} {post.category_emoji}
            </span>
          </div>
        </div>
        
        <button className="text-muted-text hover:bg-surface-container-low p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <Link to={`/posts/${post.id}`} className="block">
        <h2 className="font-headline-md text-headline-md text-on-background mb-2 flex items-center gap-2">
          {post.is_pinned && <Pin className="h-4 w-4 text-primary shrink-0" />}
          {post.is_featured && <Star className="h-4 w-4 text-secondary shrink-0" />}
          <span className="line-clamp-2">{post.title}</span>
        </h2>
        
        {!compact && (
          <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">
            {post.content}
          </p>
        )}
      </Link>

      <div className="flex items-center gap-4 text-muted-text font-label-sm text-label-sm mt-2">
        <button className="flex items-center gap-1.5 hover:text-primary transition-colors group/btn">
          <ThumbsUp className="w-4 h-4 group-hover/btn:fill-primary" /> 
          <span>12</span>
        </button>
        <Link to={`/posts/${post.id}`} className="flex items-center gap-1.5 hover:text-primary transition-colors group/btn">
          <MessageCircle className="w-4 h-4 group-hover/btn:fill-primary" /> 
          <span>4 Comments</span>
        </Link>
        <button className="flex items-center gap-1.5 hover:text-primary transition-colors ml-auto group/btn">
          <Bookmark className="w-4 h-4 group-hover/btn:fill-primary" /> 
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>
    </article>
  );
}
