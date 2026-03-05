'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { registerUser, signInWithGoogle } from '@/lib/firebase/auth';
import { useLang } from '@/app/providers';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await registerUser(email, password, name);
      toast.success('Account created! Welcome aboard.');
      router.push(redirect);
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'auth/email-already-in-use') toast.error('Email already in use');
      else toast.error('Registration failed. Please try again.');
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
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-900/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center leading-none">
            <span className="font-display text-3xl text-cream tracking-widest">HEBA</span>
            <span className="text-gold-500 text-xs tracking-[0.3em] uppercase">Coach & Educator</span>
          </Link>
        </div>

        <div className="bg-dark-900 border border-dark-700 p-8">
          <h1 className="font-display text-3xl text-cream mb-2">{t('auth.register')}</h1>
          <p className="text-dark-400 text-sm mb-8">Join thousands transforming their lives.</p>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-dark-600 hover:border-dark-400 bg-dark-800 hover:bg-dark-700 text-cream py-3 text-sm transition-all mb-6 disabled:opacity-50"
          >
            <FcGoogle size={20} />
            {t('auth.google')}
          </button>

          <div className="divider-gold text-dark-500 text-xs tracking-widest uppercase">or</div>

          <form onSubmit={handleRegister} className="space-y-5 mt-6">
            <div>
              <label className="text-dark-300 text-sm mb-2 block">{t('auth.name')}</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="input-dark pl-10" placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label className="text-dark-300 text-sm mb-2 block">{t('auth.email')}</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-dark pl-10" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="text-dark-300 text-sm mb-2 block">{t('auth.password')}</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="input-dark pl-10" placeholder="Min 8 characters" />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !name || !email || !password}
              className="btn-gold w-full justify-center disabled:opacity-50"
            >
              {loading ? <span className="spinner" /> : t('auth.register')}
            </button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-8">
            {t('auth.hasAccount')}{' '}
            <Link href="/auth/login" className="text-gold-400 hover:text-gold-300 transition-colors">{t('auth.login')}</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
