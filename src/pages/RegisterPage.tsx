import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-container">Unfiltered Campus</h1>
          <p className="text-muted-text mt-2">Join the conversation. No judgment here.</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-md border border-outline-variant">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Create account</h2>
          
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <Input label="Username" placeholder="@username" required />
            <Input 
              label="Student Email" 
              placeholder="you@university.edu" 
              type="email" 
              helperText="Must end in .edu for verification" 
              required 
            />
            <Input label="Password" placeholder="••••••••" type="password" required />
            <Input label="Confirm Password" placeholder="••••••••" type="password" required />
            
            <label className="flex items-start gap-2 mt-2 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-outline-variant text-primary-container focus:ring-primary-container" required />
              <span className="text-xs text-muted-text">
                I agree to the <a href="#" className="text-primary-container hover:underline">Community Guidelines</a> and <a href="#" className="text-primary-container hover:underline">Terms of Service</a>
              </span>
            </label>
            
            <Button type="submit" size="lg">Create account</Button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink-0 mx-4 text-sm text-muted-text">or</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>
            
            <Button variant="secondary" type="button">
              Sign up with Google
            </Button>
          </form>
        </div>
        
        <p className="text-center mt-6 text-sm text-on-surface">
          Already have an account? <Link to="/login" className="font-semibold text-primary-container hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
