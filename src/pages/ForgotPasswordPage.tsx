import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div className="max-w-[380px] w-full">
        <h1 className="font-headline-xl text-headline-xl text-primary font-bold text-center mb-6">
          Ventiora
        </h1>
        
        <div className="bg-surface rounded-[24px] p-8 shadow-md border border-border">
          {!success ? (
            <>
              <Link to="/login" className="font-label-sm text-label-sm font-semibold text-primary hover:underline mb-4 inline-block">
                â† Back to login
              </Link>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">Reset your password</h2>
              <p className="font-body-sm text-body-sm text-muted-text mb-6">
                Enter your university email and we'll send you a reset link â€” if an account exists.
              </p>
              
              <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setSuccess(true); }}>
                <input 
                  type="email" 
                  placeholder="you@university.edu" 
                  required 
                  className="w-full bg-surface-container-lowest border border-border rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
                <button 
                  type="submit" 
                  className="w-full bg-primary text-on-primary font-label-md text-label-md px-6 py-3.5 rounded-full hover:shadow-[0_4px_12px_rgba(var(--primary),0.25)] transition-all active:scale-95"
                >
                  Send reset link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">Check your inbox</h2>
              <p className="font-body-sm text-body-sm text-muted-text mb-6">
                If an account is associated with this email, a reset link is on its way. Check your spam folder too.
              </p>
              <Link to="/login" className="block w-full text-center bg-surface border border-border text-on-surface font-label-md text-label-md px-6 py-3.5 rounded-full hover:bg-surface-container-low transition-colors">
                Return to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
