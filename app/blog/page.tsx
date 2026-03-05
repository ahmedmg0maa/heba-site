'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getPosts } from '@/lib/firebase/firestore';
import { FiSearch, FiArrowRight, FiClock } from 'react-icons/fi';

const PLACEHOLDER_POSTS = [
  { id: '1', title: '5 Mindset Shifts That Will Change Everything', category: 'Mindset', readTime: '5 min', excerpt: 'Discover the most powerful thinking pattern shifts that separate high achievers from everyone else.', published: true },
  { id: '2', title: 'How to Build Unshakeable Confidence From Zero', category: 'Confidence', readTime: '7 min', excerpt: 'A science-backed framework for developing lasting self-confidence, even if you\'ve struggled your whole life.', published: true },
  { id: '3', title: 'The Science of Habit Formation (And Why Most People Get It Wrong)', category: 'Habits', readTime: '6 min', excerpt: 'What neuroscience really tells us about building habits that stick.', published: true },
  { id: '4', title: 'Emotional Intelligence: The Missing Piece in Your Success', category: 'EQ', readTime: '8 min', excerpt: 'Why EQ matters more than IQ, and how to develop it systematically.', published: true },
  { id: '5', title: 'Navigating Career Transitions With Confidence', category: 'Career', readTime: '5 min', excerpt: 'A practical guide for making career moves without losing your sense of self.', published: true },
  { id: '6', title: 'The Power of Deep Listening in Relationships', category: 'Relationships', readTime: '4 min', excerpt: 'Transform your relationships by mastering the lost art of presence.', published: true },
];

const CATEGORIES = ['All', 'Mindset', 'Confidence', 'Habits', 'EQ', 'Career', 'Relationships'];

export default function BlogPage() {
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPosts()
      .then(data => setPosts(data.length > 0 ? data : PLACEHOLDER_POSTS as Record<string, unknown>[]))
      .catch(() => setPosts(PLACEHOLDER_POSTS as Record<string, unknown>[]));
  }, []);

  const filtered = posts.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = !search || (p.title as string).toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-32 pb-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">Knowledge & Insights</div>
            <h1 className="font-display text-6xl text-cream">The Blog</h1>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="input-dark pl-10" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 text-sm whitespace-nowrap transition-all ${
                    category === cat ? 'bg-gold-500 text-dark-950 font-semibold' : 'border border-dark-700 text-dark-300 hover:border-dark-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured post */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <Link href={`/blog/${featured.id}`} className="block group border border-dark-700 hover:border-gold-700 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-gold-900/20 to-dark-800 flex items-center justify-center min-h-[240px]">
                    <span className="text-7xl opacity-20">✦</span>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-gold-500 text-dark-950 text-xs font-bold px-2 py-1">FEATURED</span>
                      <span className="text-gold-500 text-xs tracking-wider uppercase">{featured.category as string}</span>
                    </div>
                    <h2 className="font-display text-3xl text-cream group-hover:text-gold-400 transition-colors mb-4 leading-snug">{featured.title as string}</h2>
                    <p className="text-dark-400 leading-relaxed mb-6">{featured.excerpt as string}</p>
                    <div className="flex items-center gap-2 text-gold-500 text-sm">
                      Read Article <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((p, i) => (
              <motion.div
                key={p.id as string}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/blog/${p.id}`} className="block group border border-dark-800 hover:border-gold-700 transition-all duration-300 p-6 h-full flex flex-col">
                  <div className="text-gold-500 text-xs tracking-wider uppercase mb-3">{p.category as string}</div>
                  <h3 className="font-display text-xl text-cream group-hover:text-gold-400 transition-colors mb-3 leading-snug flex-1">{p.title as string}</h3>
                  <p className="text-dark-500 text-sm leading-relaxed mb-5">{p.excerpt as string}</p>
                  <div className="flex items-center gap-4 text-dark-500 text-xs">
                    <span className="flex items-center gap-1"><FiClock size={12} /> {p.readTime as string} read</span>
                    <span className="flex items-center gap-1 text-gold-500 group-hover:translate-x-1 transition-transform ml-auto">
                      Read <FiArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
