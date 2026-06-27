import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Switch } from '../common/Switch';
import { useAuth } from '../../context/AuthContext';
import { validators } from '../../utils/validators';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCancel?: () => void;
  compact?: boolean;
}

interface FormValues {
  content: string;
}

export function CommentForm({ postId, parentId, onCancel, compact }: CommentFormProps) {
  const { user } = useAuth();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  if (!user) {
    return (
      <p className="text-sm text-muted-text py-2">
        <a href="/login" className="text-primary hover:underline">Log in</a> to leave a comment.
      </p>
    );
  }

  const onSubmit = async (_data: FormValues) => {
    // Mock submit
    reset();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
      <Avatar avatarUrl={user.avatar_url} username={user.username} isAnonymous={isAnonymous} size="sm" />
      <div className="flex-1">
        <textarea
          {...register('content', validators.commentContent)}
          placeholder={parentId ? 'Write a reply…' : 'Write a comment…'}
          rows={compact ? 2 : 3}
          className={`w-full text-sm bg-surface-container border rounded-xl px-4 py-3 text-on-surface font-serif resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors ${
            errors.content ? 'border-error' : 'border-outline-variant'
          }`}
        />
        {errors.content && (
          <p className="text-xs text-error mt-1">{errors.content.message}</p>
        )}
        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
          <Switch
            checked={isAnonymous}
            onChange={setIsAnonymous}
            label="Post anonymously"
          />
          <div className="flex gap-2">
            {onCancel && (
              <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button size="sm" type="submit" isLoading={isSubmitting}>
              {submitted ? '✓ Sent!' : parentId ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
