import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (authModalMode === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      const res = await register(name, email, password);
      if (!res.success) {
        setError(res.message);
      }
    }
    setLoading(false);
  };

  const fillDemo = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@weddinvites.com');
      setPassword('admin123');
      setAuthModalMode('login');
    } else {
      setEmail('priya@example.com');
      setPassword('user123');
      setAuthModalMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#FAF0EA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#6B1D2F] px-6 py-6 text-white text-center relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 mx-auto rounded-full bg-[#E5C07B]/20 flex items-center justify-center mb-2 text-[#ECC274]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-wide">
            {authModalMode === 'login' ? 'Welcome to WeddInvites' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-[#E5C07B] mt-1 font-sans">
            {authModalMode === 'login' 
              ? 'Sign in to customize, save & download invitations'
              : 'Join thousands creating their dream wedding invites'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-gray-100 bg-[#FFFDFB]">
          <button
            onClick={() => { setAuthModalMode('login'); setError(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${
              authModalMode === 'login'
                ? 'border-[#6B1D2F] text-[#6B1D2F]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthModalMode('register'); setError(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${
              authModalMode === 'register'
                ? 'border-[#6B1D2F] text-[#6B1D2F]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            New Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Quick Demo Logins Helper */}
          <div className="mb-4 p-2.5 rounded-lg bg-[#FAF3F0] border border-[#EED7CE] flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6B1D2F] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Quick Demo Fill:
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => fillDemo('user')}
                className="px-2 py-1 text-[11px] bg-white border border-[#D9BA9B] text-[#6B1D2F] font-medium rounded hover:bg-[#6B1D2F] hover:text-white transition shadow-xs"
              >
                User (Priya)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="px-2 py-1 text-[11px] bg-[#6B1D2F] text-white font-medium rounded hover:bg-[#4E1322] transition shadow-xs"
              >
                Admin Panel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F] focus:ring-1 focus:ring-[#6B1D2F]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F] focus:ring-1 focus:ring-[#6B1D2F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B1D2F] focus:ring-1 focus:ring-[#6B1D2F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#6B1D2F] hover:bg-[#521422] text-white font-medium text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : authModalMode === 'login' ? (
                'Sign In & Continue'
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {authModalMode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode(authModalMode === 'login' ? 'register' : 'login');
                  setError('');
                }}
                className="ml-1 text-[#6B1D2F] font-semibold hover:underline"
              >
                {authModalMode === 'login' ? 'Register now' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
