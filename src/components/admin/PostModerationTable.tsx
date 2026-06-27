import React, { useState } from 'react';
import type { Post } from '../../types/post.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatShort } from '../../utils/dateFormat';
import { cn } from '../../utils/cn';

interface PostModerationTableProps {
  posts: Post[];
}

export function PostModerationTable({ posts }: PostModerationTableProps) {
  const [actionMsg, setActionMsg] = useState('');

  const doAction = (action: string, title: string) => {
    setActionMsg(`${action}: "${title.slice(0, 40)}…"`);
    setTimeout(() => setActionMsg(''), 3000);
  };

  return (
    <div>
      {actionMsg && (
        <div className="mb-3 px-4 py-2 bg-on-primary-container text-primary text-sm rounded-lg border border-primary/20">
          ✓ {actionMsg}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-xs font-semibold text-muted-text uppercase tracking-wider">
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Author</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {posts.map((post, idx) => (
              <tr
                key={post.id}
                className={cn(
                  'hover:bg-surface-container transition-colors',
                  idx % 2 !== 0 && 'bg-surface-container-low',
                )}
              >
                <td className="py-3 px-4">
                  <p className="font-medium text-on-surface line-clamp-1 max-w-xs">{post.title}</p>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">
                  {post.author.isAnonymous ? 'Anonymous' : post.author.user.username}
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs">
                    {post.category.emoji} {post.category.name}
                  </span>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">{formatShort(post.createdAt)}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {post.isPinned && <Badge variant="primary">Pinned</Badge>}
                    {post.isFeatured && <Badge variant="warning">Featured</Badge>}
                    {post.isLocked && <Badge variant="outline">Locked</Badge>}
                    {!post.isPinned && !post.isFeatured && !post.isLocked && (
                      <Badge variant="secondary">Normal</Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => doAction('Pinned', post.title)}>
                      📌
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => doAction('Featured', post.title)}>
                      ⭐
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => doAction('Locked', post.title)}>
                      🔒
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => doAction('Deleted', post.title)}>
                      🗑
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
