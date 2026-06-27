import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validators } from '../utils/validators';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const password = watch('password');

  const onSubmit = async (_data: RegisterFormValues) => {
    setSubmitted(true);
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-primary no-underline">
            Unfiltered Campus
          </Link>
          <p className="text-sm text-muted-text mt-2">Create your account</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-7 space-y-5">
          {submitted ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-semibold text-on-surface">Account created!</p>
              <p className="text-sm text-muted-text mt-1">Redirecting you to the forum…</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Username"
                  placeholder="your_handle"
                  required
                  error={errors.username?.message}
                  {...register('username', validators.username)}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@university.edu"
                  required
                  error={errors.email?.message}
                  {...register('email', validators.email)}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  required
                  error={errors.password?.message}
                  {...register('password', validators.password)}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat password"
                  required
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === password || 'Passwords do not match',
                  })}
                />
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-primary"
                    {...register('terms', { required: 'You must accept the terms' })}
                  />
                  <span className="text-sm text-on-surface-variant">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-error">{errors.terms.message}</p>
                )}
                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  Create Account
                </Button>
              </form>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-outline-variant" />
                <span className="text-xs text-muted-text">or</span>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>

              <Button variant="secondary" className="w-full" leftIcon={
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              }>
                Sign up with Google
              </Button>
            </>
          )}
        </div>

        <p className="text-sm text-center text-muted-text mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
