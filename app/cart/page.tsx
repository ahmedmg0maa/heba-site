'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart, useLang } from '@/app/providers';
import { FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { cart, removeItem, total, clearCart } = useCart();
  const { t } = useLang();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-32 pb-24">
        <div className="container-custom max-w-4xl">
          <h1 className="font-display text-5xl text-cream mb-12">{t('cart.title')}</h1>

          {cart.length === 0 ? (
            <div className="text-center py-24">
              <FiShoppingBag size={48} className="mx-auto mb-4 text-dark-600" />
              <p className="text-dark-400 text-lg mb-8">{t('cart.empty')}</p>
              <Link href="/courses" className="btn-gold">Browse Courses</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-dark-900 border border-dark-700 p-5 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-dark-800 flex items-center justify-center text-2xl shrink-0">
                      {item.type === 'course' ? '📚' : '📖'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-dark-500 text-xs uppercase tracking-wider mb-1">{item.type}</div>
                      <div className="text-cream font-semibold truncate">{item.title}</div>
                    </div>
                    <div className="text-gold-400 font-bold whitespace-nowrap">{item.price.toLocaleString()} EGP</div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-dark-600 hover:text-red-400 transition-colors ml-2"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-dark-900 border border-dark-700 p-6 sticky top-28">
                  <h2 className="font-display text-xl text-cream mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-dark-400 text-sm">
                      <span>Items ({cart.length})</span>
                      <span>{total.toLocaleString()} EGP</span>
                    </div>
                    <div className="border-t border-dark-700 pt-3 flex justify-between">
                      <span className="text-cream font-bold">{t('cart.total')}</span>
                      <span className="text-gold-400 font-bold text-xl">{total.toLocaleString()} EGP</span>
                    </div>
                  </div>
                  <Link href="/checkout" className="btn-gold w-full justify-center">
                    {t('cart.checkout')} <FiArrowRight />
                  </Link>
                  <button onClick={clearCart} className="w-full text-dark-500 text-xs mt-4 hover:text-red-400 transition-colors">
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
