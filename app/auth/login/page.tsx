'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { loginUser, signInWithGoogle } from '@/lib/firebase/auth';
import { useLang } from '@/app/providers';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await loginUser(email, password);
      toast.success('Welcome back!');
      router.push(redirect);
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'auth/invalid-credential') toast.error('Invalid email or password');
      else toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome!');
      router.push(redirect);
    } catch {
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-800/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center leading-none">
            <span className="font-display text-3xl text-cream tracking-widest">HEBA</span>
            <span className="text-gold-500 text-xs tracking-[0.3em] uppercase">Coach & Educator</span>
          </Link>
        </div>

        <div className="bg-dark-900 border border-dark-700 p-8">
          <h1 className="font-display text-3xl text-cream mb-2">{t('auth.login')}</h1>
          <p className="text-dark-400 text-sm mb-8">Welcome back. Please sign in to continue.</p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-dark-600 hover:border-dark-400 bg-dark-800 hover:bg-dark-700 text-cream py-3 text-sm transition-all mb-6 disabled:opacity-50"
          >
            <FcGoogle size={20} />
            {t('auth.google')}
          </button>

          <div className="divider-gold text-dark-500 text-xs tracking-widest uppercase">or</div>

          <form onSubmit={handleLogin} className="space-y-5 mt-6">
            <div>
              <label className="text-dark-300 text-sm mb-2 block">{t('auth.email')}</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input-dark pl-10"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-dark-300 text-sm mb-2 flex items-center justify-between">
                {t('auth.password')}
                <Link href="/auth/forgot" className="text-gold-500 text-xs hover:text-gold-400 transition-colors">
                  {t('auth.forgot')}
                </Link>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="input-dark pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                >
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-gold w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <span className="spinner" /> : t('auth.login')}
            </button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-8">
            {t('auth.noAccount')}{' '}
            <Link href={`/auth/register${redirect !== '/account' ? `?redirect=${redirect}` : ''}`} className="text-gold-400 hover:text-gold-300 transition-colors">
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
