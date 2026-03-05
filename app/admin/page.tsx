'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/providers';
import { queryCollection, createDoc, updateDocById, deleteDocById } from '@/lib/firebase/firestore';
import toast from 'react-hot-toast';
import { FiBook, FiCalendar, FiUsers, FiTag, FiPackage, FiFileText, FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';

const TABS = [
  { id: 'overview', label: 'Overview', icon: FiBook },
  { id: 'bookings', label: 'Bookings', icon: FiCalendar },
  { id: 'courses', label: 'Courses', icon: FiBook },
  { id: 'books', label: 'Books', icon: FiBook },
  { id: 'posts', label: 'Blog Posts', icon: FiFileText },
  { id: 'users', label: 'Users', icon: FiUsers },
  { id: 'coupons', label: 'Coupons', icon: FiTag },
  { id: 'orders', label: 'Orders', icon: FiPackage },
];

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="bg-dark-900 border border-dark-700 p-6">
      <div className="flex items-center justify-between mb-3">
        <Icon className="text-gold-500" size={20} />
      </div>
      <div className="font-display text-3xl text-cream mb-1">{value}</div>
      <div className="text-dark-400 text-sm">{label}</div>
    </div>
  );
}

// ─── Coupon Manager ───────────────────────────────────────────────────────────

function CouponManager() {
  const [coupons, setCoupons] = useState<Record<string, unknown>[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => queryCollection('coupons', []).then(setCoupons).catch(() => {});

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!code || !discount) { toast.error('Fill all fields'); return; }
    setLoading(true);
    try {
      await createDoc('coupons', {
        code: code.toUpperCase(),
        discount: Number(discount),
        usageLimit: usageLimit ? Number(usageLimit) : null,
        usageCount: 0,
        active: true,
      });
      toast.success('Coupon created!');
      setCode(''); setDiscount(''); setUsageLimit('');
      load();
    } catch { toast.error('Failed to create coupon'); }
    finally { setLoading(false); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await updateDocById('coupons', id, { active: !active });
    load();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await deleteDocById('coupons', id);
    load();
    toast.success('Deleted');
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-cream mb-6">Coupons</h2>
      <div className="bg-dark-900 border border-dark-700 p-6 mb-6">
        <h3 className="text-cream font-semibold mb-4">Create New Coupon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Code (e.g. SAVE20)" className="input-dark" />
          <input value={discount} onChange={e => setDiscount(e.target.value)} type="number" placeholder="Discount %" className="input-dark" />
          <input value={usageLimit} onChange={e => setUsageLimit(e.target.value)} type="number" placeholder="Usage limit (optional)" className="input-dark" />
        </div>
        <button onClick={create} disabled={loading} className="btn-gold">
          <FiPlus /> Create Coupon
        </button>
      </div>

      <div className="space-y-3">
        {coupons.map(c => (
          <div key={c.id as string} className="bg-dark-900 border border-dark-700 p-4 flex items-center justify-between">
            <div>
              <span className="text-cream font-mono font-bold">{c.code as string}</span>
              <span className="ml-3 text-gold-400">{c.discount as number}% off</span>
              {c.usageLimit && <span className="ml-3 text-dark-400 text-sm">{c.usageCount as number}/{c.usageLimit as number} uses</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 border ${c.active ? 'text-green-400 border-green-800' : 'text-dark-500 border-dark-700'}`}>
                {c.active ? 'Active' : 'Inactive'}
              </span>
              <button onClick={() => toggleActive(c.id as string, c.active as boolean)} className="text-dark-400 hover:text-cream p-1">
                {c.active ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
              <button onClick={() => deleteCoupon(c.id as string)} className="text-dark-400 hover:text-red-400 p-1">
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && <p className="text-dark-500 text-sm">No coupons yet</p>}
      </div>
    </div>
  );
}

// ─── Generic List Manager ─────────────────────────────────────────────────────

function BookingsManager() {
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    queryCollection('bookings', []).then(setBookings).catch(() => {});
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDocById('bookings', id, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Status updated to ${status}`);
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-cream mb-6">Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-dark-500">No bookings yet</p>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id as string} className="bg-dark-900 border border-dark-700 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-cream font-semibold">{b.name as string}</div>
                  <div className="text-dark-400 text-sm">{b.email as string} · {b.date as string} {b.time as string}</div>
                  <div className="text-dark-400 text-sm">{b.sessionDuration as string} min · {b.sessionType as string}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold-400 font-bold">{(b.price as number)?.toLocaleString()} EGP</span>
                  <select
                    value={b.status as string}
                    onChange={e => updateStatus(b.id as string, e.target.value)}
                    className="bg-dark-800 border border-dark-600 text-cream text-xs px-2 py-1 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ bookings: 0, users: 0, orders: 0, courses: 0 });

  useEffect(() => {
    if (!loading) {
      if (!user || userData?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (userData?.role === 'admin') {
      Promise.all([
        queryCollection('bookings', []),
        queryCollection('users', []),
        queryCollection('orders', []),
        queryCollection('courses', []),
      ]).then(([b, u, o, c]) => setStats({ bookings: b.length, users: u.length, orders: o.length, courses: c.length })).catch(() => {});
    }
  }, [userData]);

  if (loading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="spinner scale-150" />
    </div>
  );

  if (!user || userData?.role !== 'admin') return null;

  return (
    <main className="min-h-screen bg-dark-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark-900 border-r border-dark-800 min-h-screen fixed left-0 top-0 z-40">
          <div className="p-6 border-b border-dark-800">
            <div className="font-display text-xl text-cream">Admin Panel</div>
            <div className="text-dark-400 text-xs mt-1">{user.email}</div>
          </div>
          <nav className="p-4 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all ${
                  activeTab === id
                    ? 'bg-gold-900/20 text-gold-400 border-l-2 border-gold-500'
                    : 'text-dark-400 hover:text-cream hover:bg-dark-800'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="ml-64 flex-1 p-8">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-display text-4xl text-cream mb-8">Dashboard</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Bookings" value={stats.bookings} icon={FiCalendar} />
                <StatCard label="Total Users" value={stats.users} icon={FiUsers} />
                <StatCard label="Total Orders" value={stats.orders} icon={FiPackage} />
                <StatCard label="Active Courses" value={stats.courses} icon={FiBook} />
              </div>
              <div className="bg-dark-900 border border-dark-700 p-6">
                <h2 className="font-display text-xl text-cream mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('coupons')} className="btn-outline text-sm py-2 px-4">
                    <FiPlus /> Create Coupon
                  </button>
                  <button onClick={() => setActiveTab('bookings')} className="btn-outline text-sm py-2 px-4">
                    <FiCalendar /> Manage Bookings
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'bookings' && <BookingsManager />}
          {activeTab === 'coupons' && <CouponManager />}

          {activeTab === 'users' && (
            <div>
              <h2 className="font-display text-2xl text-cream mb-6">Users</h2>
              <p className="text-dark-500">User management — connect Firestore to view users</p>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="font-display text-2xl text-cream mb-6">Orders</h2>
              <p className="text-dark-500">Order management dashboard</p>
            </div>
          )}

          {['courses', 'books', 'posts'].includes(activeTab) && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-cream capitalize">{activeTab}</h2>
                <button className="btn-gold text-sm py-2 px-5">
                  <FiPlus /> Add New
                </button>
              </div>
              <p className="text-dark-500">Manage {activeTab} — CRUD interface connects to Firestore</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
