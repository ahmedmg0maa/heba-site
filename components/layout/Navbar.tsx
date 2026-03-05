'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang, useAuth, useCart } from '@/app/providers';
import { signOut } from '@/lib/firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { t, lang, setLang, dir } = useLang();
  const { user, userData } = useAuth();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/coaching', label: t('nav.coaching') },
    { href: '/courses', label: t('nav.courses') },
    { href: '/books', label: t('nav.books') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
    setUserMenu(false);
  };

  const isAdmin = userData?.role === 'admin';

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-950/95 backdrop-blur-md border-b border-dark-700'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl text-cream tracking-widest">HEBA</span>
          <span className="text-gold-500 text-xs tracking-[0.3em] uppercase">Coach & Educator</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm tracking-widest uppercase transition-colors animated-underline ${
                pathname === l.href ? 'text-gold-400' : 'text-dark-300 hover:text-cream'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="text-xs tracking-widest text-dark-300 hover:text-gold-400 transition-colors uppercase border border-dark-600 px-3 py-1 hover:border-gold-600"
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>

          {/* Cart */}
          <Link href="/cart" className="relative text-dark-300 hover:text-cream transition-colors">
            <FiShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-dark-950 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 text-dark-300 hover:text-cream transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gold-600 flex items-center justify-center text-dark-950 font-bold text-sm">
                  {user.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>
              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-52 bg-dark-900 border border-dark-700 shadow-2xl py-2"
                  >
                    <div className="px-4 py-2 border-b border-dark-700 mb-2">
                      <p className="text-cream text-sm font-medium truncate">{user.displayName}</p>
                      <p className="text-dark-400 text-xs truncate">{user.email}</p>
                    </div>
                    <Link href="/account" className="flex items-center gap-3 px-4 py-2 text-dark-300 hover:text-cream hover:bg-dark-800 text-sm transition-colors" onClick={() => setUserMenu(false)}>
                      <FiUser size={14} /> {t('nav.account')}
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-gold-400 hover:text-gold-300 hover:bg-dark-800 text-sm transition-colors" onClick={() => setUserMenu(false)}>
                        ⚙ Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-dark-300 hover:text-red-400 hover:bg-dark-800 text-sm transition-colors">
                      <FiLogOut size={14} /> {t('nav.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/auth/login" className="btn-gold text-xs py-2 px-5 hidden sm:inline-flex">
              {t('nav.login')}
            </Link>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-cream hover:text-gold-400 transition-colors"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-950 border-t border-dark-700 overflow-hidden"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm tracking-widest uppercase py-2 border-b border-dark-800 ${
                    pathname === l.href ? 'text-gold-400' : 'text-dark-300'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {!user && (
                <Link href="/auth/login" onClick={() => setOpen(false)} className="btn-gold text-center mt-2">
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
