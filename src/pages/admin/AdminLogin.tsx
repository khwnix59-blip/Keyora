import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@keyora.studio');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to admin dashboard
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@keyora.studio');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F0E6] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[#C9A24B]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#121212] border border-[#C9A24B]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Logo on Admin Login */}
        <div className="flex flex-col items-center mb-8">
          <Logo variant="gold-on-dark" size="lg" showTagline={false} />
          <div className="mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-[#C9A24B] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Storefront Administration</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@keyora.studio"
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
              Master Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] text-[#0B0B0B] font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 gold-glow hover:opacity-95 transition-all disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Studio'}</span>
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <p className="text-[11px] text-neutral-400 mb-2">
            Default credentials for instant preview:
          </p>
          <div className="bg-[#181818] border border-neutral-800 rounded-lg p-2.5 text-[11px] font-mono text-[#E6C97A] flex items-center justify-between">
            <span>admin@keyora.studio / admin123</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#C9A24B] hover:underline font-sans text-xs ml-2 uppercase tracking-wider"
            >
              Auto Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
