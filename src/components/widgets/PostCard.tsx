import React from 'react';
import { ThumbsUp, MessageCircle, Bookmark, UserX, User, Pin, Star, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { formatDistanceToNow } from '../../utils/date';
import { motion } from 'framer-motion';
import type { Post } from '../../types/post.types';

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const isAnonymous = post.isAnonymous;
  const displayName = isAnonymous ? 'Anonymous' : `@${!post.author.isAnonymous ? post.author.user.username : 'Anonymous'}`;

  return (
    <motion.article 
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="bg-surface rounded-xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none transition-shadow border border-transparent hover:border-border group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {isAnonymous ? (
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
              <UserX className="w-4 h-4" />
            </div>
          ) : (
            <div className="shrink-0">
              <Avatar avatarUrl={undefined} username={!post.author.isAnonymous ? post.author.user.username : undefined} size="sm" />
            </div>
          )}
          
          <div className="flex flex-col">
            <span className={`font-label-sm text-label-sm font-semibold ${isAnonymous ? 'text-muted-text' : 'text-primary'}`}>
              {displayName}
            </span>
            <span className="font-label-sm text-label-sm text-muted-text">
              {formatDistanceToNow(new Date(post.createdAt))} • {post.category.name} {post.category.emoji}
            </span>
          </div>
        </div>
        
        <button className="text-muted-text hover:bg-surface-container-low p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <Link to={`/posts/${post.id}`} className="block">
        <h2 className="font-headline-md text-headline-md text-on-background mb-2 flex items-center gap-2">
          {post.isPinned && <Pin className="h-4 w-4 text-primary shrink-0" />}
          {post.isFeatured && <Star className="h-4 w-4 text-secondary shrink-0" />}
          <span className="line-clamp-2">{post.title}</span>
        </h2>
        
        {!compact && (
          <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">
            {post.content}
          </p>
        )}
      </Link>

      <div className="flex items-center gap-4 text-muted-text font-label-sm text-label-sm mt-2">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className={`flex items-center gap-1.5 hover:text-primary transition-colors group/btn ${post.reactions[0]?.reacted ? 'text-primary' : ''}`}
        >
          <ThumbsUp className={`w-4 h-4 group-hover/btn:fill-primary ${post.reactions[0]?.reacted ? 'fill-primary' : ''}`} /> 
          <span>{post.reactions[0]?.count || 0}</span>
        </motion.button>
        <Link to={`/posts/${post.id}`} className="flex items-center gap-1.5 hover:text-primary transition-colors group/btn">
          <motion.div whileTap={{ scale: 0.9 }}>
             <MessageCircle className="w-4 h-4 group-hover/btn:fill-primary" />
          </motion.div>
          <span>{post.commentCount} Comments</span>
        </Link>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 hover:text-primary transition-colors ml-auto group/btn"
        >
          <Bookmark className="w-4 h-4 group-hover/btn:fill-primary" /> 
          <span className="hidden sm:inline">Save</span>
        </motion.button>
      </div>
    </motion.article>
  );
}
