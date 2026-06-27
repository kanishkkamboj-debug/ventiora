import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

interface ResetFormValues {
  newPassword: string;
  confirmPassword: string;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>();

  const newPassword = watch('newPassword');

  const onSubmit = async () => {
    setDone(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-primary no-underline">
            Unfiltered Campus
          </Link>
          <p className="text-sm text-muted-text mt-2">Set a new password</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-7">
          {done ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">✅</div>
              <h2 className="font-bold text-on-surface">Password reset!</h2>
              <p className="text-sm text-muted-text">Redirecting you to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="Min. 8 characters"
                required
                error={errors.newPassword?.message}
                {...register('newPassword', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Must be at least 8 characters' },
                })}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat new password"
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === newPassword || 'Passwords do not match',
                })}
              />
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
