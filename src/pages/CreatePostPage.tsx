import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { PostForm } from '../components/post/PostForm';

interface CreatePostPageProps {
  editMode?: boolean;
}

export function CreatePostPage({ editMode }: CreatePostPageProps) {
  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <PostForm mode={editMode ? 'edit' : 'create'} />
      </div>
    </PageWrapper>
  );
}
