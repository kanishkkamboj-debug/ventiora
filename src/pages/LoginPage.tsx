import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login('test@university.edu', 'password');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-container flex items-center justify-center gap-2">
            <span className="text-4xl">🎓</span>
            Unfiltered Campus
          </h1>
          <p className="text-muted-text mt-2">Your campus. Unfiltered.</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-md border border-outline-variant">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Log in</h2>
          
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <Input label="University Email" placeholder="you@university.edu" type="email" required />
            <div>
              <Input label="Password" placeholder="••••••••" type="password" required />
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-xs font-semibold text-primary-container hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <Button type="submit" size="lg" className="mt-2">Log in</Button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink-0 mx-4 text-sm text-muted-text">or</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>
            
            <Button variant="secondary" type="button">
              Continue with Google
            </Button>
          </form>
        </div>
        
        <p className="text-center mt-6 text-sm text-on-surface">
          Don't have an account? <Link to="/register" className="font-semibold text-primary-container hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
