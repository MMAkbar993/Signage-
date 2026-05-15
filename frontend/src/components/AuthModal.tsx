import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, AtSign } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  React.useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loginWithGoogle, register } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsSubmitting(false);
          return;
        }
        if (username.trim() && username.trim().length < 3) {
          setError('Username must be at least 3 characters');
          setIsSubmitting(false);
          return;
        }
        await register(email, password, username.trim() || undefined, firstName || undefined, lastName || undefined);
      }
      resetForm();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-100 mt-1">
            {mode === 'login'
              ? 'Sign in to access your Safete Gram.In account'
              : 'Join Safete Gram.In to save your signages'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {googleClientId && (
            <div className="flex flex-col items-center gap-2">
              <GoogleLogin
                theme="filled"
                size="large"
                text={mode === 'login' ? 'signin_with' : 'signup_with'}
                width="100%"
                onSuccess={(credentialResponse) => {
                  const token = credentialResponse.credential;
                  if (token) {
                    setError('');
                    setIsSubmitting(true);
                    loginWithGoogle(token)
                      .then(() => {
                        resetForm();
                        onClose();
                      })
                      .catch((err: unknown) => {
                        setError(err instanceof Error ? err.message : 'Google sign-in failed');
                      })
                      .finally(() => setIsSubmitting(false));
                  }
                }}
                onError={() => {
                  setError('Google sign-in was cancelled or failed');
                }}
              />
              <p className="text-slate-500 text-sm">or continue with email</p>
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    placeholder="e.g. john_doe"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Letters, numbers, underscore, hyphen. Min 3 chars. Used to find you in chat.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            </>
          )}

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? 'Enter password' : 'Min 6 characters'}
                required
                minLength={mode === 'signup' ? 6 : undefined}
                className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>

          <p className="text-center text-slate-600 text-sm">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={switchMode}
              className="text-blue-600 font-medium hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
