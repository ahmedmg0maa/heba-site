'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getBooks } from '@/lib/firebase/firestore';
import { useCart } from '@/app/providers';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiStar } from 'react-icons/fi';

const PLACEHOLDER_BOOKS = [
  { id: '1', title: 'The Mindset Revolution', subtitle: 'Rewire Your Brain, Transform Your Life', price: 250, rating: 4.9, reviews: 320, pages: 280, description: 'A comprehensive guide to understanding and reshaping your mindset using cutting-edge neuroscience and practical exercises.', published: true },
  { id: '2', title: 'Confidence By Design', subtitle: 'The Blueprint to Unshakeable Self-Belief', price: 199, rating: 4.8, reviews: 215, pages: 220, description: 'Step-by-step strategies to build lasting confidence from the inside out.', published: true },
  { id: '3', title: 'The Emotional Edge', subtitle: 'Mastering Your Inner World', price: 220, rating: 4.9, reviews: 280, pages: 260, description: 'Learn the emotional intelligence skills that separate extraordinary people from everyone else.', published: true },
];

export default function BooksPage() {
  const [books, setBooks] = useState<Record<string, unknown>[]>([]);
  const { addItem, cart } = useCart();

  useEffect(() => {
    getBooks()
      .then(data => setBooks(data.length > 0 ? data : PLACEHOLDER_BOOKS as Record<string, unknown>[]))
      .catch(() => setBooks(PLACEHOLDER_BOOKS as Record<string, unknown>[]));
  }, []);

  const handleAdd = (b: Record<string, unknown>) => {
    if (cart.find(i => i.id === (b.id as string))) { toast.error('Already in cart'); return; }
    addItem({ id: b.id as string, type: 'book', title: b.title as string, price: b.price as number });
    toast.success('Added to cart!');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-32 pb-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">Published Works</div>
            <h1 className="font-display text-6xl text-cream">Books</h1>
          </div>

          <div className="space-y-8">
            {books.map((b, i) => (
              <motion.div
                key={b.id as string}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-dark-900 border border-dark-700 hover:border-gold-700 transition-all duration-300 p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                  {/* Book cover placeholder */}
                  <div className="aspect-[2/3] bg-gradient-to-br from-gold-800/20 to-dark-800 border border-gold-800/20 flex items-center justify-center max-w-[140px] mx-auto md:mx-0">
                    <span className="font-display text-3xl text-gold-600/40">✦</span>
                  </div>

                  {/* Info */}
                  <div className="md:col-span-2">
                    <h2 className="font-display text-2xl text-cream mb-1">{b.title as string}</h2>
                    <p className="text-gold-500 text-sm italic mb-4">{b.subtitle as string}</p>
                    <p className="text-dark-400 leading-relaxed mb-5">{b.description as string}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FiStar size={14} className="text-gold-500" fill="currentColor" />
                        <span className="text-cream font-semibold">{b.rating as number}</span>
                        <span className="text-dark-500">({b.reviews as number} reviews)</span>
                      </div>
                      <span className="text-dark-600">·</span>
                      <span className="text-dark-400">{b.pages as number} pages</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center md:text-right">
                    <div className="font-display text-3xl text-gold-400 mb-4">{(b.price as number)?.toLocaleString()} EGP</div>
                    <button onClick={() => handleAdd(b)} className="btn-gold w-full md:w-auto justify-center">
                      <FiShoppingCart /> Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
