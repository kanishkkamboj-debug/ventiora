import React from 'react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import type { User } from '../../types/user.types';
import { formatShort } from '../../utils/dateFormat';
import { Button } from '../common/Button';
import { ROLE_LABELS } from '../../utils/constants';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

export function ProfileHeader({ user, isOwnProfile, onEdit }: ProfileHeaderProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6">
      <div className="flex items-start gap-5">
        <Avatar
          avatarUrl={user.avatarUrl}
          username={user.username}
          size="xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-on-surface">@{user.username}</h1>
            {user.role !== 'STUDENT' && (
              <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'primary'}>
                {ROLE_LABELS[user.role]}
              </Badge>
            )}
            {user.status !== 'ACTIVE' && (
              <Badge variant="warning">{user.status}</Badge>
            )}
          </div>
          {user.bio && (
            <p className="text-sm text-on-surface-variant mt-2">{user.bio}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-text">
            <span>📅 Joined {formatShort(user.createdAt)}</span>
            <span>📝 {user.postCount} posts</span>
            <span>💬 {user.commentCount} comments</span>
          </div>
        </div>
        {isOwnProfile && (
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}
