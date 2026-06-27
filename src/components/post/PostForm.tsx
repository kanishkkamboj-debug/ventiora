import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { AnonymousToggle } from './AnonymousToggle';
import { CategorySelect } from '../category/CategorySelect';
import { TagInput } from '../category/TagInput';
import { mockCategories, mockTags } from '../../utils/mockData';
import type { CreatePostRequest } from '../../types/post.types';
import { validators } from '../../utils/validators';

interface PostFormProps {
  mode?: 'create' | 'edit';
  defaultValues?: Partial<CreatePostRequest>;
  onSubmit?: (data: CreatePostRequest) => void;
}

interface FormValues {
  title: string;
  content: string;
  categoryId: string;
  isAnonymous: boolean;
}

export function PostForm({ mode = 'create', defaultValues, onSubmit }: PostFormProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(defaultValues?.isAnonymous ?? false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      content: defaultValues?.content ?? '',
      categoryId: defaultValues?.categoryId ?? '',
      isAnonymous: false,
    },
  });

  const categoryId = watch('categoryId');

  const handleFormSubmit = async (data: FormValues) => {
    const payload: CreatePostRequest = {
      ...data,
      isAnonymous,
      tagIds: tags,
    };
    onSubmit?.(payload);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-10 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-xl font-bold text-on-surface mb-2">
          {mode === 'create' ? 'Post created!' : 'Post updated!'}
        </h2>
        <p className="text-muted-text text-sm">Your post is now live on Unfiltered Campus.</p>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>
          {mode === 'create' ? 'Create another' : 'Back to editing'}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 space-y-5"
    >
      <div>
        <h2 className="text-lg font-bold text-on-surface">
          {mode === 'create' ? 'Create a new post' : 'Edit post'}
        </h2>
        <p className="text-sm text-muted-text mt-1">
          Share your thoughts with the campus community.
        </p>
      </div>

      <Input
        label="Title"
        placeholder="What's on your mind?"
        required
        error={errors.title?.message}
        {...register('title', validators.postTitle)}
      />

      <Textarea
        label="Content"
        placeholder="Write your post here…"
        required
        error={errors.content?.message}
        className="min-h-[200px]"
        {...register('content', validators.postContent)}
      />

      <CategorySelect
        categories={mockCategories}
        value={categoryId}
        onChange={(val) => setValue('categoryId', val)}
        required
        error={errors.categoryId?.message}
      />

      <TagInput
        value={tags}
        onChange={setTags}
        suggestions={mockTags}
      />

      <AnonymousToggle value={isAnonymous} onChange={setIsAnonymous} />

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant">
        <Button variant="secondary" type="button">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {mode === 'create' ? 'Publish Post' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
