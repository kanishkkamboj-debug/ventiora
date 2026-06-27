import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="max-w-[380px] w-full">
        <h1 className="text-2xl font-bold text-primary-container text-center mb-6">Unfiltered Campus</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-md border border-outline-variant">
          {!success ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-primary-container hover:underline mb-4 inline-block">
                ← Back to login
              </Link>
              <h2 className="text-2xl font-bold text-on-surface mb-2">Reset password</h2>
              <p className="text-sm text-muted-text mb-6">
                Enter your university email and we'll send you a reset link — if an account exists.
              </p>
              
              <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setSuccess(true); }}>
                <Input placeholder="you@university.edu" type="email" required />
                <Button type="submit" size="lg">Send reset link</Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="h-12 w-12 bg-primary-container/10 text-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">Check your inbox</h2>
              <p className="text-sm text-muted-text mb-6">
                If an account is associated with this email, a reset link is on its way. Check your spam folder too.
              </p>
              <Link to="/login">
                <Button variant="outline" fullWidth>Return to login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
