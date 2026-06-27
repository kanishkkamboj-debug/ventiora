import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { User } from '../../types/user.types';

interface ProfileEditFormProps {
  user: User;
  onCancel: () => void;
  onSave: (data: { username: string; bio: string; avatar_url: string }) => void;
}

export function ProfileEditForm({ user, onCancel, onSave }: ProfileEditFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      username: user.username,
      bio: user.bio ?? '',
      avatar_url: user.avatar_url ?? '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 space-y-4"
    >
      <h2 className="text-base font-bold text-on-surface">Edit Profile</h2>

      <Input
        label="Username"
        {...register('username', { required: 'Username is required' })}
        error={errors.username?.message}
      />
      <Textarea
        label="Bio"
        placeholder="Tell the community about yourself…"
        {...register('bio')}
        className="min-h-[80px]"
      />
      <Input
        label="Avatar URL"
        placeholder="https://…"
        {...register('avatar_url')}
      />

      <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
