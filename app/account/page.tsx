'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth, useLang } from '@/app/providers';
import { getUserBookings, getUserOrders, updateDocById } from '@/lib/firebase/firestore';
import toast from 'react-hot-toast';
import { FiCalendar, FiBook, FiPackage, FiSettings, FiUser, FiEdit } from 'react-icons/fi';

const TABS = [
  { id: 'sessions', icon: FiCalendar, label: 'My Sessions' },
  { id: 'courses', icon: FiBook, label: 'My Courses' },
  { id: 'orders', icon: FiPackage, label: 'My Orders' },
  { id: 'settings', icon: FiSettings, label: 'Settings' },
];

export default function AccountPage() {
  const { user, userData, loading } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'sessions');
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/account');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      getUserBookings(user.uid).then(setBookings).catch(() => {});
      getUserOrders(user.uid).then(setOrders).catch(() => {});
    }
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDocById('users', user.uid, { displayName });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="spinner scale-150" />
      </div>
    );
  }

  if (!user) return null;

  const statusColor = (s: string) => {
    if (s === 'confirmed') return 'text-green-400 bg-green-900/20 border-green-800';
    if (s === 'pending') return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
    if (s === 'cancelled') return 'text-red-400 bg-red-900/20 border-red-800';
    return 'text-dark-400 bg-dark-800 border-dark-700';
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-32 pb-24">
        <div className="container-custom max-w-5xl">
          {/* Profile header */}
          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 bg-gold-600 rounded-full flex items-center justify-center text-dark-950 font-bold text-2xl font-display">
              {user.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-display text-3xl text-cream">{user.displayName}</h1>
              <p className="text-dark-400 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {TABS.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-all ${
                      activeTab === id
                        ? 'bg-gold-900/20 border-l-2 border-gold-500 text-gold-400'
                        : 'text-dark-400 hover:text-cream hover:bg-dark-800'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Sessions tab */}
              {activeTab === 'sessions' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-2xl text-cream mb-6">{t('account.sessions')}</h2>
                  {bookings.length === 0 ? (
                    <div className="text-center py-16 text-dark-500">
                      <FiCalendar size={32} className="mx-auto mb-3" />
                      <p>No sessions booked yet</p>
                      <a href="/coaching" className="btn-gold mt-6 inline-flex">Book a Session</a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((b) => (
                        <div key={b.id as string} className="bg-dark-900 border border-dark-700 p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-cream font-semibold">{b.sessionDuration as string} min — {b.sessionType as string}</div>
                              <div className="text-dark-400 text-sm mt-1">{b.date as string} at {b.time as string}</div>
                            </div>
                            <span className={`text-xs px-2 py-1 border ${statusColor(b.status as string)}`}>
                              {(b.status as string).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-gold-500 text-sm mt-3">{(b.price as number)?.toLocaleString()} EGP</div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Courses tab */}
              {activeTab === 'courses' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-2xl text-cream mb-6">{t('account.courses')}</h2>
                  <div className="text-center py-16 text-dark-500">
                    <FiBook size={32} className="mx-auto mb-3" />
                    <p>No courses purchased yet</p>
                    <a href="/courses" className="btn-gold mt-6 inline-flex">Browse Courses</a>
                  </div>
                </motion.div>
              )}

              {/* Orders tab */}
              {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-2xl text-cream mb-6">{t('account.orders')}</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-16 text-dark-500">
                      <FiPackage size={32} className="mx-auto mb-3" />
                      <p>No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((o) => (
                        <div key={o.id as string} className="bg-dark-900 border border-dark-700 p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-cream text-sm">Order #{(o.id as string).slice(-8)}</div>
                              <div className="text-dark-400 text-xs mt-1">{(o.items as unknown[])?.length} items</div>
                            </div>
                            <div className="text-gold-400 font-bold">{(o.total as number)?.toLocaleString()} EGP</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Settings tab */}
              {activeTab === 'settings' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-2xl text-cream mb-6">{t('account.settings')}</h2>
                  <div className="bg-dark-900 border border-dark-700 p-6 space-y-5">
                    <div>
                      <label className="text-dark-300 text-sm mb-2 block">Display Name</label>
                      <input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="input-dark"
                      />
                    </div>
                    <div>
                      <label className="text-dark-300 text-sm mb-2 block">Email</label>
                      <input value={user.email || ''} disabled className="input-dark opacity-50 cursor-not-allowed" />
                    </div>
                    <button onClick={saveProfile} disabled={saving} className="btn-gold">
                      {saving ? <span className="spinner" /> : 'Save Changes'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
