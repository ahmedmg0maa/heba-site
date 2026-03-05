'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, useAuth } from '@/app/providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiCheck, FiClock, FiVideo, FiPhone, FiCalendar } from 'react-icons/fi';
import { getBookingsForDate, createDoc } from '@/lib/firebase/firestore';
import { getCoupon } from '@/lib/firebase/firestore';

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSIONS = [
  { id: '60', label: '60-Minute Session', price: 1500, duration: 60 },
  { id: '90', label: '90-Minute Session', price: 1800, duration: 90 },
];

const TYPES = [
  { id: 'online', label: 'Online Meeting', icon: FiVideo },
  { id: 'phone', label: 'Phone Call', icon: FiPhone },
];

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const h = i + 9;
  return { value: `${h.toString().padStart(2, '0')}:00`, label: h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM` };
});

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// ─── Calendar Component ───────────────────────────────────────────────────────

function BookingCalendar({ onSelect, selected }: { onSelect: (d: string) => void; selected: string }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (d: number) => {
    const date = new Date(viewYear, viewMonth, d);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const day = date.getDay(); // 0=Sun, 5=Fri, 6=Sat
    return date < todayStart || day === 5 || day === 6;
  };

  return (
    <div className="bg-dark-800 border border-dark-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="text-dark-400 hover:text-cream transition-colors p-2">‹</button>
        <h3 className="text-cream font-display text-lg">{monthName}</h3>
        <button onClick={nextMonth} className="text-dark-400 hover:text-cream transition-colors p-2">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-dark-500 text-xs py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const dateStr = formatDate(viewYear, viewMonth, d);
          const disabled = isDisabled(d);
          const isSelected = selected === dateStr;
          return (
            <button
              key={d}
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className={`w-full aspect-square flex items-center justify-center text-sm transition-all duration-200 ${
                isSelected
                  ? 'bg-gold-500 text-dark-950 font-bold'
                  : disabled
                  ? 'text-dark-700 cursor-not-allowed'
                  : 'text-dark-300 hover:bg-dark-700 hover:text-cream cursor-pointer'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function Steps({ current }: { current: number }) {
  const steps = ['Session', 'Date & Time', 'Details', 'Payment'];
  return (
    <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 text-sm whitespace-nowrap ${i < current ? 'text-gold-500' : i === current ? 'text-cream' : 'text-dark-600'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
              i < current ? 'bg-gold-500 border-gold-500 text-dark-950' :
              i === current ? 'border-cream text-cream' : 'border-dark-700 text-dark-700'
            }`}>
              {i < current ? <FiCheck size={12} /> : i + 1}
            </div>
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-px min-w-[20px] ${i < current ? 'bg-gold-500' : 'bg-dark-700'}`} />}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CoachingPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [session, setSession] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedSession = SESSIONS.find(s => s.id === session);
  const price = selectedSession ? Math.round(selectedSession.price * (1 - discount / 100)) : 0;

  // Load booked times when date changes
  useEffect(() => {
    if (!date) return;
    setLoading(true);
    getBookingsForDate(date)
      .then(bookings => setBookedTimes(bookings.map((b: Record<string, unknown>) => b.time as string)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [date]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const coupons = await getCoupon(couponCode);
      if (coupons.length === 0) { toast.error('Invalid or expired coupon'); return; }
      const c = coupons[0] as Record<string, unknown>;
      const now = new Date();
      if (c.expiresAt && (c.expiresAt as { toDate: () => Date }).toDate() < now) { toast.error('Coupon has expired'); return; }
      if (c.usageLimit && (c.usageCount as number) >= (c.usageLimit as number)) { toast.error('Coupon usage limit reached'); return; }
      setDiscount(c.discount as number);
      setCouponId(c.id as string);
      toast.success(`Coupon applied! ${c.discount}% off`);
    } catch {
      toast.error('Error applying coupon');
    }
  };

  const handleSubmit = async () => {
    if (!user) { router.push('/auth/login?redirect=/coaching'); return; }
    if (!session || !sessionType || !date || !time || !name || !email) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await createDoc('bookings', {
        userId: user.uid,
        sessionDuration: session,
        sessionType,
        date,
        time,
        name,
        email,
        phone,
        notes,
        price,
        status: 'pending',
        couponId: couponId || null,
      });
      toast.success('Booking submitted! You will receive a confirmation email shortly.');
      router.push('/account?tab=sessions');
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-32 pb-24">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">1:1 Coaching</div>
            <h1 className="font-display text-6xl text-cream mb-4">{t('coaching.title')}</h1>
            <p className="text-dark-300 max-w-xl mx-auto">
              A personalized coaching session tailored to your unique challenges and goals. Choose your format and let's begin.
            </p>
          </div>

          <Steps current={step} />

          {/* Step 0: Choose Session */}
          {step === 0 && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-2xl text-cream mb-8">Choose Your Session</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {SESSIONS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSession(s.id)}
                    className={`p-8 border text-left transition-all duration-300 ${
                      session === s.id
                        ? 'border-gold-500 bg-gold-900/20'
                        : 'border-dark-700 hover:border-dark-500 bg-dark-900'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <FiClock className={session === s.id ? 'text-gold-500' : 'text-dark-500'} size={24} />
                      {session === s.id && <FiCheck className="text-gold-500" />}
                    </div>
                    <h3 className="font-display text-xl text-cream mb-2">{s.label}</h3>
                    <p className="text-dark-400 text-sm mb-4">{s.duration} minutes of focused, personalized coaching</p>
                    <div className="text-gold-400 text-xl font-bold">{s.price.toLocaleString()} EGP</div>
                  </button>
                ))}
              </div>

              <h2 className="font-display text-2xl text-cream mb-6">Session Format</h2>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {TYPES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSessionType(id)}
                    className={`p-6 border flex flex-col items-center gap-3 transition-all duration-300 ${
                      sessionType === id
                        ? 'border-gold-500 bg-gold-900/20 text-cream'
                        : 'border-dark-700 text-dark-400 hover:border-dark-500'
                    }`}
                  >
                    <Icon size={28} />
                    <span className="text-sm font-semibold">{label}</span>
                  </button>
                ))}
              </div>

              <button
                disabled={!session || !sessionType}
                onClick={() => setStep(1)}
                className="btn-gold w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Date Selection →
              </button>
            </motion.div>
          )}

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-2xl text-cream mb-8">Choose Date & Time</h2>
              <p className="text-dark-400 text-sm mb-6">Working hours: 9 AM – 8 PM · Friday and Saturday unavailable</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <BookingCalendar onSelect={setDate} selected={date} />

                <div>
                  <h3 className="text-cream font-semibold mb-4 flex items-center gap-2">
                    <FiClock size={16} className="text-gold-500" />
                    Available Times
                    {date && <span className="text-dark-400 text-xs font-normal">for {date}</span>}
                  </h3>
                  {!date ? (
                    <p className="text-dark-500 text-sm">Please select a date first</p>
                  ) : loading ? (
                    <div className="text-dark-400 text-sm">Loading available times...</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {HOURS.map(h => {
                        const isBooked = bookedTimes.includes(h.value);
                        return (
                          <button
                            key={h.value}
                            disabled={isBooked}
                            onClick={() => setTime(h.value)}
                            className={`py-2.5 px-3 text-sm border transition-all ${
                              time === h.value
                                ? 'border-gold-500 bg-gold-900/30 text-gold-400'
                                : isBooked
                                ? 'border-dark-800 text-dark-700 cursor-not-allowed line-through'
                                : 'border-dark-700 text-dark-300 hover:border-dark-500 hover:text-cream'
                            }`}
                          >
                            {h.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">← Back</button>
                <button
                  disabled={!date || !time}
                  onClick={() => setStep(2)}
                  className="btn-gold flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-2xl text-cream mb-8">Your Details</h2>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="text-dark-300 text-sm mb-2 block">Full Name *</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="input-dark" placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-dark-300 text-sm mb-2 block">Email *</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="input-dark" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-dark-300 text-sm mb-2 block">Phone Number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="input-dark" placeholder="+20 xxx xxx xxxx" />
                </div>
                <div>
                  <label className="text-dark-300 text-sm mb-2 block">What would you like to focus on?</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={4}
                    className="input-dark resize-none"
                    placeholder="Briefly describe your goals or challenges..."
                  />
                </div>

                {/* Coupon */}
                <div>
                  <label className="text-dark-300 text-sm mb-2 block">Coupon Code (optional)</label>
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="input-dark flex-1"
                      placeholder="Enter code"
                    />
                    <button onClick={applyCoupon} className="btn-outline px-5 py-3 text-sm">Apply</button>
                  </div>
                  {discount > 0 && (
                    <p className="text-green-400 text-xs mt-2">✓ {discount}% discount applied!</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">← Back</button>
                <button
                  disabled={!name || !email}
                  onClick={() => setStep(3)}
                  className="btn-gold flex-1 justify-center disabled:opacity-50"
                >
                  Review & Pay →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm & Pay */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-2xl text-cream mb-8">Confirm Booking</h2>

              <div className="bg-dark-900 border border-dark-700 p-8 mb-8 space-y-4">
                <h3 className="font-display text-lg text-cream border-b border-dark-700 pb-3 mb-4">Booking Summary</h3>
                {[
                  { label: 'Session', value: SESSIONS.find(s => s.id === session)?.label },
                  { label: 'Format', value: TYPES.find(t => t.id === sessionType)?.label },
                  { label: 'Date', value: date },
                  { label: 'Time', value: HOURS.find(h => h.value === time)?.label },
                  { label: 'Name', value: name },
                  { label: 'Email', value: email },
                  ...(phone ? [{ label: 'Phone', value: phone }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-dark-400 text-sm">{label}</span>
                    <span className="text-cream text-sm">{value}</span>
                  </div>
                ))}

                <div className="border-t border-dark-700 pt-4 mt-4">
                  {discount > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-dark-400">Original Price</span>
                      <span className="text-dark-500 line-through">{selectedSession?.price.toLocaleString()} EGP</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-400">Discount ({discount}%)</span>
                      <span className="text-green-400">-{(selectedSession!.price - price).toLocaleString()} EGP</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-cream font-bold">Total</span>
                    <span className="text-gold-400 font-bold text-xl">{price.toLocaleString()} EGP</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-800 border border-dark-700 p-6 mb-8">
                <h3 className="text-cream font-semibold mb-4">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="border border-gold-600 bg-gold-900/20 p-3 text-gold-400 text-sm font-semibold">
                    💳 Paymob
                  </button>
                  <button className="border border-dark-600 p-3 text-dark-300 text-sm">
                    📱 InstaPay
                  </button>
                </div>
                <p className="text-dark-500 text-xs mt-3">Secure payment processing. Your data is protected.</p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="btn-outline flex-1 justify-center">← Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-gold flex-1 justify-center disabled:opacity-50"
                >
                  {submitting ? 'Booking...' : `Confirm & Pay ${price.toLocaleString()} EGP`}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
