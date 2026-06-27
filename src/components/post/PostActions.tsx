import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '../../types/post.types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { ReportButton } from '../report/ReportButton';

interface PostActionsProps {
  post: Post;
}

export function PostActions({ post }: PostActionsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isOwner =
    !post.author.isAnonymous && user && post.author.user.id === user.id;
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isOwner && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/posts/${post.id}/edit`)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
        >
          Edit
        </Button>
      )}
      {user && <ReportButton targetType="POST" targetId={post.id} />}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
        }}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        }
      >
        Share
      </Button>
    </div>
  );
}
