import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { PostDetail } from '../components/post/PostDetail';
import { CommentSection } from '../components/comment/CommentSection';
import { mockPosts, mockComments } from '../utils/mockData';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find((p) => p.id === id) ?? mockPosts[0];
  const comments = mockComments.filter((c) => c.postId === post.id);

  if (!post) {
    return (
      <PageWrapper>
        <EmptyState
          title="Post not found"
          description="The post you're looking for doesn't exist or was removed."
          action={
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          }
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-text mb-4">
          <Link to="/" className="hover:text-primary transition-colors no-underline">
            Home
          </Link>
          <span>/</span>
          <Link
            to={`/?category=${post.category.slug}`}
            className="hover:text-primary transition-colors no-underline"
          >
            {post.category.emoji} {post.category.name}
          </Link>
          <span>/</span>
          <span className="text-on-surface font-medium line-clamp-1">{post.title}</span>
        </nav>

        <PostDetail post={post} />
        <CommentSection
          postId={post.id}
          comments={comments}
          isLocked={post.isLocked}
        />
      </div>
    </PageWrapper>
  );
}
