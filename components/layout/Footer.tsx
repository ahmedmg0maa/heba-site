'use client';

import Link from 'next/link';
import { useLang } from '@/app/providers';
import { FiInstagram, FiYoutube, FiFacebook, FiLinkedin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-dark-950 border-t border-dark-800">
      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/201000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-400 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-green-900/30 transition-all duration-300 hover:scale-110"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex flex-col leading-none mb-4">
              <span className="font-display text-3xl text-cream tracking-widest">HEBA</span>
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase">Coach & Educator</span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed max-w-xs">
              Empowering individuals to unlock their potential through transformative coaching, education, and personal development.
            </p>
            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              {[
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiYoutube, href: '#', label: 'YouTube' },
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-dark-700 flex items-center justify-center text-dark-400 hover:text-gold-400 hover:border-gold-600 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg text-cream mb-6 tracking-wider">Explore</h3>
            <ul className="space-y-3">
              {[
                { href: '/about', label: t('nav.about') },
                { href: '/coaching', label: t('nav.coaching') },
                { href: '/courses', label: t('nav.courses') },
                { href: '/books', label: t('nav.books') },
                { href: '/blog', label: t('nav.blog') },
                { href: '/contact', label: t('nav.contact') },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-dark-400 text-sm hover:text-gold-400 transition-colors animated-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg text-cream mb-6 tracking-wider">Connect</h3>
            <ul className="space-y-3 text-dark-400 text-sm">
              <li>
                <a href="mailto:heba@example.com" className="hover:text-gold-400 transition-colors">
                  heba@example.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/201000000000" className="hover:text-gold-400 transition-colors">
                  WhatsApp: +20 100 000 0000
                </a>
              </li>
              <li className="text-dark-500">Cairo, Egypt</li>
            </ul>

            <div className="mt-8">
              <h4 className="text-cream text-sm font-semibold mb-3 tracking-wider uppercase">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-dark-800 border border-dark-600 text-cream placeholder-dark-500 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
                />
                <button className="bg-gold-500 text-dark-950 px-4 py-2 text-sm font-bold hover:bg-gold-400 transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-xs tracking-wider">
            © {new Date().getFullYear()} Heba. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-dark-500 text-xs hover:text-dark-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-dark-500 text-xs hover:text-dark-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
