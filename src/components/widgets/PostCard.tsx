import React from 'react';
import { Heart, MessageCircle, MoreHorizontal, Pin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { formatDistanceToNow } from '../../utils/date';
import { cn } from '../ui/Button';

interface PostCardProps {
  post: any; // We'll type this properly later with the Post type
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  return (
    <article className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant hover:border-outline transition-colors group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <Avatar 
            user={{ username: post.author_username } as any} 
            isAnonymous={post.is_anonymous} 
            size="sm" 
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-bold", post.is_anonymous ? "text-muted-text" : "text-on-surface")}>
                {post.is_anonymous ? 'Anonymous' : `@${post.author_username}`}
              </span>
              <span className="text-xs text-muted-text">•</span>
              <span className="text-xs text-muted-text">{formatDistanceToNow(new Date(post.created_at))}</span>
            </div>
            {!compact && (
              <Badge variant="secondary" className="w-fit mt-1 gap-1">
                <span>{post.category_emoji}</span> {post.category_name}
              </Badge>
            )}
          </div>
        </div>
        <button className="text-muted-text hover:bg-surface p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <Link to={`/posts/${post.id}`} className="block">
        <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
          {post.is_pinned && <Pin className="h-4 w-4 text-primary-container fill-primary-container" />}
          {post.is_featured && <Star className="h-4 w-4 text-secondary-container fill-secondary-container" />}
          {post.title}
        </h2>
        {!compact && (
          <p className="text-on-surface/80 text-sm line-clamp-3 leading-relaxed mb-4 font-serif">
            {post.content}
          </p>
        )}
      </Link>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/50">
        <button className="flex items-center gap-1.5 text-muted-text hover:text-error transition-colors group/btn">
          <Heart className="h-4 w-4 group-hover/btn:fill-error" />
          <span className="text-xs font-semibold">12</span>
        </button>
        <Link to={`/posts/${post.id}`} className="flex items-center gap-1.5 text-muted-text hover:text-primary-container transition-colors group/btn">
          <MessageCircle className="h-4 w-4 group-hover/btn:fill-primary-container" />
          <span className="text-xs font-semibold">4</span>
        </Link>
      </div>
    </article>
  );
}
