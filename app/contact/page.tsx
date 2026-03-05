'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { createDoc } from '@/lib/firebase/firestore';
import { useLang } from '@/app/providers';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill required fields'); return; }
    setLoading(true);
    try {
      await createDoc('contacts', { ...form, read: false });
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: 'heba@example.com', href: 'mailto:heba@example.com' },
    { icon: FiPhone, label: 'WhatsApp', value: '+20 100 000 0000', href: 'https://wa.me/201000000000' },
    { icon: FiMapPin, label: 'Location', value: 'Cairo, Egypt', href: null },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-32 pb-24">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-16">
            <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">Get in Touch</div>
            <h1 className="font-display text-6xl text-cream mb-4">Contact</h1>
            <p className="text-dark-300 max-w-md mx-auto">Have a question or want to discuss how we can work together? I'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div className="space-y-6">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold-700/40 flex items-center justify-center text-gold-500 shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="text-dark-400 text-xs tracking-wider uppercase mb-1">{label}</div>
                    {href ? (
                      <a href={href} className="text-cream hover:text-gold-400 transition-colors">{value}</a>
                    ) : (
                      <span className="text-cream">{value}</span>
                    )}
                  </div>
                </div>
              ))}

              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500/10 border border-green-700/40 px-5 py-4 text-green-400 hover:bg-green-500/20 transition-all mt-8"
              >
                <FaWhatsapp size={20} />
                <span className="font-semibold">Chat on WhatsApp</span>
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-dark-900 border border-dark-700 p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-dark-300 text-sm mb-2 block">Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-dark" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="text-dark-300 text-sm mb-2 block">Email *</label>
                    <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="input-dark" placeholder="your@email.com" required />
                  </div>
                </div>
                <div>
                  <label className="text-dark-300 text-sm mb-2 block">Subject</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-dark" placeholder="How can I help?" />
                </div>
                <div>
                  <label className="text-dark-300 text-sm mb-2 block">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={6}
                    required
                    className="input-dark resize-none"
                    placeholder="Tell me about your situation and what you're looking for..."
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-gold group w-full justify-center">
                  {loading ? <span className="spinner" /> : (<><FiSend /> Send Message</>)}
                </button>
              </motion.form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
