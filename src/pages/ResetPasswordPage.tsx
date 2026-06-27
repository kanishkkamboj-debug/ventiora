import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="max-w-[380px] w-full">
        <div className="bg-white rounded-2xl p-8 shadow-md border border-outline-variant">
          {!success ? (
            <>
              <h2 className="text-2xl font-bold text-on-surface mb-6">Choose a new password</h2>
              <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setSuccess(true); }}>
                <Input label="New Password" placeholder="••••••••" type="password" helperText="Must be at least 8 characters" required />
                <Input label="Confirm Password" placeholder="••••••••" type="password" required />
                <Button type="submit" size="lg" className="mt-2">Set new password</Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="h-12 w-12 bg-primary-container/10 text-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">Password updated!</h2>
              <p className="text-sm text-muted-text mb-6">
                Your password has been successfully reset.
              </p>
              <Link to="/login">
                <Button fullWidth>Continue to login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
