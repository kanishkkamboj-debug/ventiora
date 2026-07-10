import React, { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import type { User } from '../../types/user.types';
import { formatShort } from '../../utils/date';
import { Button } from '../ui/Button';
import { ROLE_LABELS } from '../../utils/constants';

interface ProfileHeaderProps {
  user: User & { post_count?: number; comment_count?: number };
  isOwnProfile: boolean;
  onEdit?: () => void;
}

export function ProfileHeader({ user, isOwnProfile, onEdit }: ProfileHeaderProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6">
      <div className="flex items-start gap-5">
        <Avatar
          avatarUrl={user.avatar_url}
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
            {user.is_suspended && (
              <Badge variant="warning">SUSPENDED</Badge>
            )}
            {user.is_banned && (
              <Badge variant="destructive">BANNED</Badge>
            )}
          </div>
          {user.bio && (
            <p className="text-sm text-on-surface-variant mt-2">{user.bio}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-text">
            <span>📅 Joined {formatShort(user.created_at)}</span>
            <span>📝 {user.post_count ?? 0} posts</span>
            <span>💬 {user.comment_count ?? 0} comments</span>
          </div>
          {/* Supplemental profile details (gender, age range, interests) */}
          {(user.gender || user.age_range || (user.interests && user.interests.length > 0)) && (
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {user.gender && (
                <span className="text-xs bg-surface-container px-2 py-1 rounded-md text-on-surface-variant">
                  Gender: {user.gender}
                </span>
              )}
              {user.age_range && (
                <span className="text-xs bg-surface-container px-2 py-1 rounded-md text-on-surface-variant">
                  Age: {user.age_range}
                </span>
              )}
              {user.interests?.map((interest) => (
                <span
                  key={interest}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md"
                >
                  #{interest}
                </span>
              ))}
            </div>
          )}
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
