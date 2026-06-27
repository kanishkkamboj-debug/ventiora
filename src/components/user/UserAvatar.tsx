import { Link } from 'react-router-dom';
import type { PostAuthor } from '../../types/user.types';
import { Avatar } from '../common/Avatar';

interface UserAvatarProps {
  author: PostAuthor;
  size?: 'sm' | 'md' | 'lg';
  showUsername?: boolean;
  clickable?: boolean;
}

export function UserAvatar({ author, size = 'md', showUsername = false, clickable = true }: UserAvatarProps) {
  if (author.isAnonymous) {
    return (
      <div className="flex items-center gap-2">
        <Avatar username="Anonymous" size={size} isAnonymous />
        {showUsername && (
          <span className="text-sm font-medium text-on-surface-variant italic">Anonymous</span>
        )}
      </div>
    );
  }

  const content = (
    <div className="flex items-center gap-2">
      <Avatar avatarUrl={author.user.avatar_url ?? undefined} username={author.user.username} size={size} />
      {showUsername && (
        <span className="text-sm font-semibold text-on-surface">{author.user.username}</span>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link
        to={`/users/${author.user.username}`}
        className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}
