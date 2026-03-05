'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getCourses } from '@/lib/firebase/firestore';
import { useCart } from '@/app/providers';
import { FiSearch, FiShoppingCart, FiStar, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Mindset', 'Confidence', 'Leadership', 'Psychology', 'Career', 'Relationships'];

const PLACEHOLDER_COURSES = [
  { id: '1', title: 'Master Your Mindset', category: 'Mindset', price: 499, originalPrice: 699, rating: 4.9, students: 1240, description: 'Rewire your thinking patterns and unlock your full potential through neuroscience-backed techniques.', published: true, featured: true },
  { id: '2', title: 'The Confidence Blueprint', category: 'Confidence', price: 699, rating: 4.8, students: 890, description: 'Build unshakeable self-confidence through a proven 8-week system used by top performers.', published: true },
  { id: '3', title: 'Emotional Intelligence Mastery', category: 'Psychology', price: 599, rating: 4.9, students: 1100, description: 'Develop the emotional skills that separate great leaders from good ones.', published: true, featured: true },
  { id: '4', title: 'Leadership Excellence', category: 'Leadership', price: 799, rating: 4.7, students: 560, description: 'Elevate your leadership presence and inspire peak performance in your team.', published: true },
  { id: '5', title: 'Career Transformation', category: 'Career', price: 549, rating: 4.8, students: 780, description: 'Navigate career transitions with clarity, strategy, and unwavering confidence.', published: true },
  { id: '6', title: 'Relationship Intelligence', category: 'Relationships', price: 449, rating: 4.9, students: 940, description: 'Build deeper connections and resolve conflicts with empathy and emotional skill.', published: true },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { addItem, cart } = useCart();

  useEffect(() => {
    getCourses().then(data => {
      setCourses(data.length > 0 ? data : PLACEHOLDER_COURSES as Record<string, unknown>[]);
    }).catch(() => setCourses(PLACEHOLDER_COURSES as Record<string, unknown>[]));
  }, []);

  const filtered = courses.filter(c => {
    const matchCat = category === 'All' || c.category === category;
    const matchSearch = !search || (c.title as string).toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (c: Record<string, unknown>) => {
    if (cart.find(i => i.id === (c.id as string))) {
      toast.error('Already in cart');
      return;
    }
    addItem({ id: c.id as string, type: 'course', title: c.title as string, price: c.price as number });
    toast.success('Added to cart!');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-32 pb-24">
        {/* Header */}
        <div className="bg-dark-900 border-b border-dark-800 pb-16 mb-12">
          <div className="container-custom text-center pt-8">
            <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">Online Learning</div>
            <h1 className="font-display text-6xl text-cream mb-4">Courses</h1>
            <p className="text-dark-300 max-w-xl mx-auto">
              Structured learning programs designed to create real, lasting transformation.
            </p>
          </div>
        </div>

        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="input-dark pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 text-sm whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-gold-500 text-dark-950 font-semibold'
                      : 'border border-dark-700 text-dark-300 hover:border-dark-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id as string}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="card-dark group overflow-hidden flex flex-col"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-gold-900/20 to-dark-800 relative mb-5">
                  {c.featured && (
                    <div className="absolute top-3 left-3 bg-gold-500 text-dark-950 text-xs font-bold px-2 py-1">
                      FEATURED
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl opacity-20">✦</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col px-2 pb-2">
                  <div className="text-gold-500 text-xs tracking-wider uppercase mb-2">{c.category as string}</div>
                  <h3 className="font-display text-xl text-cream group-hover:text-gold-400 transition-colors mb-2">{c.title as string}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed mb-4 flex-1">{c.description as string}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <FiStar size={12} className="text-gold-500" fill="currentColor" />
                      <span className="text-cream text-sm font-semibold">{c.rating as number}</span>
                    </div>
                    <span className="text-dark-600">·</span>
                    <span className="text-dark-400 text-xs">{(c.students as number)?.toLocaleString()} students</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gold-400 font-bold text-lg">{(c.price as number)?.toLocaleString()} EGP</span>
                      {c.originalPrice && (
                        <span className="text-dark-600 text-sm line-through ml-2">{(c.originalPrice as number)?.toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(c)}
                      className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-dark-950 text-xs font-bold px-3 py-2 transition-colors"
                    >
                      <FiShoppingCart size={12} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-dark-500">
              No courses found. Try a different search or category.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
