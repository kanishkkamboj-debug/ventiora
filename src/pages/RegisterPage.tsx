import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div className="max-w-[400px] w-full">
        <div className="text-center mb-8">
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold mb-1">
            Ventiora
          </h1>
          <p className="font-body-md text-body-md text-muted-text">Join the conversation. No judgment here.</p>
        </div>
        
        <div className="bg-surface rounded-[24px] p-8 shadow-md border border-border">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-6">Create account</h2>
          
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Username</label>
              <input 
                type="text" 
                placeholder="@username" 
                required 
                className="w-full bg-surface-container-lowest border border-border rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Student Email</label>
              <input 
                type="email" 
                placeholder="you@university.edu" 
                required 
                className="w-full bg-surface-container-lowest border border-border rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              />
              <span className="font-label-sm text-label-sm text-muted-text italic mt-0.5">Must end in .edu for verification</span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
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
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Confirm Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                required 
                className="w-full bg-surface-container-lowest border border-border rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>
            
            <label className="flex items-start gap-3 mt-2 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input type="checkbox" className="peer sr-only" required />
                <div className="w-5 h-5 border-2 border-border rounded flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all">
                  <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-muted-text leading-relaxed">
                I agree to the <a href="#" className="text-primary hover:underline font-semibold">Community Guidelines</a> and <a href="#" className="text-primary hover:underline font-semibold">Terms of Service</a>
              </span>
            </label>
            
            <button 
              type="submit" 
              className="mt-2 w-full bg-primary text-on-primary font-label-md text-label-md px-6 py-3.5 rounded-full hover:shadow-[0_4px_12px_rgba(var(--primary),0.25)] transition-all active:scale-95"
            >
              Create account
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 font-label-sm text-label-sm text-muted-text">â€” or â€”</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
            
            <button 
              type="button"
              className="w-full bg-surface border border-border text-on-surface font-label-md text-label-md px-6 py-3.5 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 font-body-sm text-body-sm text-muted-text">
          Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
