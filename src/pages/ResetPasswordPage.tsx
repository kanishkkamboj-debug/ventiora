import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Check } from 'lucide-react';

export function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div className="max-w-[380px] w-full">
        <h1 className="font-headline-xl text-headline-xl text-primary font-bold text-center mb-6">
          Unfiltered Campus
        </h1>
        
        <div className="bg-white rounded-[24px] p-8 shadow-md">
          {!success ? (
            <>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-6">Choose a new password</h2>
              <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setSuccess(true); }}>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-semibold text-on-surface">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      required 
                      className="w-full bg-surface-container-lowest border border-border rounded-xl pl-4 pr-12 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-text hover:text-on-surface transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <span className="font-label-sm text-label-sm text-muted-text italic mt-0.5">Must be at least 8 characters</span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-semibold text-on-surface">Confirm Password</label>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    required 
                    className="w-full bg-surface-container-lowest border border-border rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="mt-2 w-full bg-primary text-on-primary font-label-md text-label-md px-6 py-3.5 rounded-full hover:shadow-[0_4px_12px_rgba(var(--primary),0.25)] transition-all active:scale-95"
                >
                  Set new password
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">Password updated!</h2>
              <p className="font-body-sm text-body-sm text-muted-text mb-6">
                Your password has been successfully reset.
              </p>
              <Link to="/login" className="block w-full text-center bg-primary text-on-primary font-label-md text-label-md px-6 py-3.5 rounded-full hover:shadow-[0_4px_12px_rgba(var(--primary),0.25)] transition-all active:scale-95">
                Continue to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
