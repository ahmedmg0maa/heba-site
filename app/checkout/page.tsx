'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart, useAuth } from '@/app/providers';
import { createDoc } from '@/lib/firebase/firestore';
import { getCoupon } from '@/lib/firebase/firestore';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState('paymob');
  const [loading, setLoading] = useState(false);

  const finalTotal = Math.round(total * (1 - discount / 100));

  const applyCoupon = async () => {
    const results = await getCoupon(coupon);
    if (results.length === 0) { toast.error('Invalid coupon'); return; }
    const c = results[0] as Record<string, unknown>;
    setDiscount(c.discount as number);
    toast.success(`${c.discount}% discount applied!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/auth/login?redirect=/checkout'); return; }
    setLoading(true);
    try {
      await createDoc('orders', {
        userId: user.uid,
        items: cart.map(i => ({ id: i.id, title: i.title, type: i.type, price: i.price })),
        total: finalTotal,
        name, email, phone,
        paymentMethod: payment,
        status: 'pending',
        discount,
      });
      clearCart();
      toast.success('Order placed! You will receive a confirmation email.');
      router.push('/account?tab=orders');
    } catch {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-dark-950 pt-32 pb-24 flex items-center justify-center">
          <div className="text-center">
            <p className="text-dark-400 mb-4">Your cart is empty</p>
            <a href="/courses" className="btn-gold">Browse Courses</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-32 pb-24">
        <div className="container-custom max-w-5xl">
          <h1 className="font-display text-5xl text-cream mb-12">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-dark-900 border border-dark-700 p-6">
                  <h2 className="font-display text-xl text-cream mb-5">Personal Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-dark-300 text-sm mb-2 block">Full Name *</label>
                      <input value={name} onChange={e => setName(e.target.value)} required className="input-dark" />
                    </div>
                    <div>
                      <label className="text-dark-300 text-sm mb-2 block">Email *</label>
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="input-dark" />
                    </div>
                    <div>
                      <label className="text-dark-300 text-sm mb-2 block">Phone</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} className="input-dark" />
                    </div>
                  </div>
                </div>

                <div className="bg-dark-900 border border-dark-700 p-6">
                  <h2 className="font-display text-xl text-cream mb-5">Payment Method</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'paymob', label: '💳 Paymob', desc: 'Credit/Debit Card' },
                      { id: 'instapay', label: '📱 InstaPay', desc: 'Mobile Payment' },
                    ].map(pm => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPayment(pm.id)}
                        className={`p-4 border text-left transition-all ${
                          payment === pm.id ? 'border-gold-500 bg-gold-900/20' : 'border-dark-700 hover:border-dark-500'
                        }`}
                      >
                        <div className="text-cream font-semibold text-sm">{pm.label}</div>
                        <div className="text-dark-400 text-xs mt-0.5">{pm.desc}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-dark-500 text-xs mt-3 flex items-center gap-1">
                    <FiLock size={10} /> Secure, encrypted payment
                  </p>
                </div>
              </div>

              {/* Right: Order summary */}
              <div>
                <div className="bg-dark-900 border border-dark-700 p-6 sticky top-28">
                  <h2 className="font-display text-xl text-cream mb-5">Order Summary</h2>

                  <div className="space-y-3 mb-5">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-dark-300 truncate pr-3">{item.title}</span>
                        <span className="text-cream whitespace-nowrap">{item.price.toLocaleString()} EGP</span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="border-t border-dark-700 pt-4 mb-4">
                    <div className="flex gap-2">
                      <input
                        value={coupon}
                        onChange={e => setCoupon(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        className="input-dark flex-1 text-sm py-2"
                      />
                      <button type="button" onClick={applyCoupon} className="btn-outline py-2 px-3 text-xs">Apply</button>
                    </div>
                    {discount > 0 && <p className="text-green-400 text-xs mt-2">✓ {discount}% discount applied</p>}
                  </div>

                  <div className="space-y-2 border-t border-dark-700 pt-4 mb-6">
                    <div className="flex justify-between text-sm text-dark-400">
                      <span>Subtotal</span><span>{total.toLocaleString()} EGP</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Discount</span><span>-{(total - finalTotal).toLocaleString()} EGP</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-dark-700">
                      <span className="text-cream">Total</span>
                      <span className="text-gold-400">{finalTotal.toLocaleString()} EGP</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
                    {loading ? <span className="spinner" /> : `Pay ${finalTotal.toLocaleString()} EGP`}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
