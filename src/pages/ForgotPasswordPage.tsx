import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validators } from '../utils/validators';

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>();

  const onSubmit = async (_data: { email: string }) => {
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-primary no-underline">
            Unfiltered Campus
          </Link>
          <p className="text-sm text-muted-text mt-2">Reset your password</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-7">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">📧</div>
              <h2 className="font-bold text-on-surface">Check your email</h2>
              <p className="text-sm text-muted-text">
                If an account exists for that email, we've sent a password reset link.
              </p>
              <Link to="/login" className="block text-sm text-primary hover:underline no-underline mt-4">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <p className="text-sm text-on-surface-variant">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <Input
                label="Email"
                type="email"
                placeholder="you@university.edu"
                required
                error={errors.email?.message}
                {...register('email', validators.email)}
              />
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Send Reset Link
              </Button>
              <Link
                to="/login"
                className="block text-sm text-center text-muted-text hover:text-primary no-underline transition-colors"
              >
                ← Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
