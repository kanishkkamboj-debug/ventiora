import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Switch } from '../common/Switch';
import { Button } from '../common/Button';

interface AnnouncementFormValues {
  title: string;
  body: string;
  expiresAt?: string;
}

export function AnnouncementComposer() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<AnnouncementFormValues>();

  const onSubmit = async (_data: AnnouncementFormValues) => {
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-surface-container rounded-xl p-5 space-y-4"
    >
      <h3 className="text-sm font-bold text-on-surface">New Announcement</h3>
      {submitted && (
        <div className="px-3 py-2 bg-on-primary-container text-primary text-sm rounded-lg border border-primary/20">
          ✓ Announcement published!
        </div>
      )}
      <Input
        label="Title"
        placeholder="Announcement headline"
        required
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />
      <Textarea
        label="Body"
        placeholder="Announcement body text…"
        required
        error={errors.body?.message}
        {...register('body', { required: 'Body is required' })}
        className="min-h-[80px]"
      />
      <Input
        label="Expires At (optional)"
        type="datetime-local"
        {...register('expiresAt')}
      />
      <Switch
        checked={isHighlighted}
        onChange={setIsHighlighted}
        label="Highlight this announcement"
        description="Displayed with primary color emphasis"
      />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Publish Announcement
        </Button>
      </div>
    </form>
  );
}
