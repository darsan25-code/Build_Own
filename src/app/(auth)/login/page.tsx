'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: true });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const targetUrl =
        data.user.role === 'PLATFORM_ADMIN'
          ? '/platform-admin'
          : data.user.role === 'CHAPTER_ADMIN' || data.user.role === 'CHAPTER_OFFICER'
          ? '/chapter-admin'
          : '/student';

      window.location.href = targetUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email: string) => {
    setError('');
    setLoading(true);
    const password = 'Password123!';
    setFormData({ email, password, rememberMe: true });

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Demo login failed');
      }

      const targetUrl =
        data.user.role === 'PLATFORM_ADMIN'
          ? '/platform-admin'
          : data.user.role === 'CHAPTER_ADMIN' || data.user.role === 'CHAPTER_OFFICER'
          ? '/chapter-admin'
          : '/student';

      window.location.href = targetUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
        
        {/* Left Hero Card Inspired by Screen 3 */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0B1E3D] via-[#003B6E] to-[#005596] text-white p-8 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 acm-pattern-grid opacity-15 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-extrabold text-xl mb-6 shadow-inner border border-white/20">
              acm
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back!</h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Sign in to your ACM account and continue your journey in the global computing community.
            </p>
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 relative z-10 shadow-sm">
            <p className="italic text-xs text-blue-50 font-medium leading-relaxed">
              &quot;Advancing Computing as a Science & Profession.&quot;
            </p>
          </div>
        </div>

        {/* Right Form Area */}
        <div className="md:col-span-7 space-y-6 flex flex-col justify-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Access your member dashboard and event passes.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold rounded-xl animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005596] text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005596] text-slate-900 placeholder-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="rounded text-[#005596] focus:ring-[#005596] w-4 h-4"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-[#005596] hover:underline font-bold">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#005596] hover:bg-[#003B6E] active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Login Credentials */}
          <div className="space-y-3 pt-2">
            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Demo Credentials
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin('alex@xyz.edu')}
                className="py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-[#005596] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>Demo Student</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoLogin('chapteradmin@xyz.edu')}
                className="py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-[#005596] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>Demo Admin</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 pt-2 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#005596] font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
