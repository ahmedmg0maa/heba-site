'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useLang } from '@/app/providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FiArrowRight, FiStar, FiPlay, FiCheck } from 'react-icons/fi';
import { getLatestPosts, getTestimonials, getCourses } from '@/lib/firebase/firestore';

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

function AnimSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-dark-950">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Circular ornament */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-gold-900/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold-800/15 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-gold-700/10 rounded-full" />

        {/* Gold gradient blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gold-600/8 rounded-full blur-3xl" />

        {/* Decorative lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold-800/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold-800/20 to-transparent" />
      </div>

      <motion.div style={{ y, opacity }} className="relative container-custom pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 border border-gold-700/50 bg-gold-900/20 px-5 py-2 text-gold-400 text-xs tracking-[0.3em] uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
            Professional Coach & Educator
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-cream leading-none tracking-tight mb-8"
          >
            Transform
            <br />
            <span className="text-gold-gradient italic">Your Life</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-dark-300 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Discover a path to personal mastery through expert coaching, transformative courses, and proven frameworks that create lasting change.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/coaching" className="btn-gold group">
              {t('hero.cta')}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="btn-outline group">
              {t('hero.learn')}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-dark-800 max-w-lg mx-auto"
          >
            {[
              { value: '500+', label: 'Clients Coached' },
              { value: '10+', label: 'Years Experience' },
              { value: '50+', label: 'Online Courses' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl text-gold-400">{s.value}</div>
                <div className="text-dark-400 text-xs tracking-wider uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-500"
      >
        <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-dark-500 to-transparent" />
      </motion.div>
    </section>
  );
}

// ─── About Preview ────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section className="section-padding bg-dark-950 relative">
      <div className="absolute inset-0 bg-gradient-radial from-gold-900/5 to-transparent" />
      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <AnimSection>
            <div className="relative">
              <div className="aspect-[3/4] bg-dark-800 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gold-600/20 border border-gold-600/40 flex items-center justify-center mx-auto mb-4">
                      <span className="font-display text-5xl text-gold-400">H</span>
                    </div>
                    <p className="text-dark-400 text-sm">Coach Photo</p>
                  </div>
                </div>
                {/* Decorative border */}
                <div className="absolute bottom-4 right-4 left-4 top-4 border border-gold-800/30 pointer-events-none" />
              </div>
              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -right-6 bottom-16 bg-dark-900 border border-dark-700 p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <FiStar key={i} className="text-gold-400" size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-cream text-sm font-semibold">4.9/5</span>
                </div>
                <p className="text-dark-400 text-xs mt-1">500+ Reviews</p>
              </motion.div>
            </div>
          </AnimSection>

          {/* Content */}
          <div>
            <AnimSection>
              <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">About Me</div>
              <h2 className="font-display text-5xl text-cream mb-6 leading-tight">
                Helping You Become<br />
                <span className="text-gold-gradient italic">Your Best Self</span>
              </h2>
            </AnimSection>
            <AnimSection className="mt-4">
              <p className="text-dark-300 leading-relaxed mb-4">
                With over a decade of experience in personal development and professional coaching, I've guided hundreds of individuals to breakthrough their limitations and create extraordinary results in every area of their lives.
              </p>
              <p className="text-dark-300 leading-relaxed mb-8">
                My approach combines evidence-based psychological frameworks with practical, actionable strategies that work in the real world — regardless of your starting point.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'ICF Certified Professional Coach',
                  'Master\'s in Psychology',
                  'Published Author of 3 Books',
                  'TEDx Speaker',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-dark-300 text-sm">
                    <FiCheck className="text-gold-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn-outline inline-flex group">
                My Full Story <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ─────────────────────────────────────────────────────────

function ServicesSection() {
  const { t } = useLang();
  const services = [
    {
      icon: '🎯',
      title: '1:1 Coaching',
      desc: 'Personalized sessions designed around your unique goals and challenges.',
      href: '/coaching',
      price: 'From 1,500 EGP',
    },
    {
      icon: '📚',
      title: 'Online Courses',
      desc: 'Structured learning programs you can complete at your own pace.',
      href: '/courses',
      price: 'From 299 EGP',
    },
    {
      icon: '📖',
      title: 'Books & Resources',
      desc: 'Deep-dive publications packed with transformative insights.',
      href: '/books',
      price: 'From 150 EGP',
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      desc: 'Get instant guidance from my AI, trained on my coaching philosophy.',
      href: '#ai-chat',
      price: 'Free',
    },
  ];

  return (
    <section className="section-padding bg-dark-900">
      <div className="container-custom">
        <AnimSection className="text-center mb-16">
          <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">{t('section.services')}</div>
          <h2 className="font-display text-5xl text-cream">What I Offer</h2>
        </AnimSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link href={s.href} className="block card-dark group h-full p-8">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-display text-xl text-cream mb-2 group-hover:text-gold-400 transition-colors">{s.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed mb-4">{s.desc}</p>
                <div className="text-gold-500 text-xs font-semibold tracking-wider uppercase">{s.price}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Courses Highlight ────────────────────────────────────────────────────────

function CoursesSection({ courses }: { courses: Record<string, unknown>[] }) {
  const { t } = useLang();

  const placeholderCourses = [
    { id: '1', title: 'Master Your Mindset', category: 'Psychology', price: 499, students: 1240 },
    { id: '2', title: 'The Confidence Blueprint', category: 'Personal Dev', price: 699, students: 890 },
    { id: '3', title: 'Emotional Intelligence', category: 'Psychology', price: 599, students: 1100 },
  ];

  const displayCourses = courses.length > 0 ? courses : placeholderCourses;

  return (
    <section className="section-padding bg-dark-950">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-16">
          <AnimSection>
            <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">{t('section.courses')}</div>
            <h2 className="font-display text-5xl text-cream">Featured Courses</h2>
          </AnimSection>
          <Link href="/courses" className="hidden sm:flex items-center gap-2 text-gold-400 text-sm hover:text-gold-300 transition-colors group">
            View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayCourses.slice(0, 3).map((c: Record<string, unknown>, i) => (
            <motion.div
              key={(c.id as string) || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link href={`/courses/${c.id}`} className="block card-dark group overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gold-900/30 to-dark-800 mb-4 flex items-center justify-center">
                  <span className="font-display text-4xl text-gold-500/40">✦</span>
                </div>
                <div className="px-2 pb-2">
                  <div className="text-gold-500 text-xs tracking-wider uppercase mb-2">{c.category as string}</div>
                  <h3 className="font-display text-xl text-cream group-hover:text-gold-400 transition-colors mb-3">{c.title as string}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gold-400 font-bold">{c.price as number} EGP</span>
                    <span className="text-dark-500 text-xs">{(c.students as number)?.toLocaleString()} students</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection({ testimonials }: { testimonials: Record<string, unknown>[] }) {
  const { t } = useLang();

  const placeholders = [
    { name: 'Sarah K.', role: 'Entrepreneur', text: 'Working with Heba completely transformed how I approach challenges. My business grew 3x in just 6 months.' },
    { name: 'Ahmed M.', role: 'Corporate Manager', text: 'The coaching sessions helped me find clarity I never knew was possible. Highly recommend to anyone feeling stuck.' },
    { name: 'Nour F.', role: 'Life Coach Trainee', text: 'The courses are world-class. Practical, deep, and immediately applicable. Worth every penny.' },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : placeholders;

  return (
    <section className="section-padding bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-gold-900/5 to-transparent" />
      <div className="container-custom relative">
        <AnimSection className="text-center mb-16">
          <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">{t('section.testimonials')}</div>
          <h2 className="font-display text-5xl text-cream">
            Real Stories, <span className="text-gold-gradient italic">Real Results</span>
          </h2>
        </AnimSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTestimonials.map((item: Record<string, unknown>, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="card-dark p-8 relative"
            >
              <div className="font-display text-6xl text-gold-800/40 absolute top-4 right-6 leading-none">"</div>
              <div className="flex mb-4">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} size={14} className="text-gold-500" fill="currentColor" />
                ))}
              </div>
              <p className="text-dark-300 text-sm leading-relaxed mb-6 italic">"{item.text as string}"</p>
              <div>
                <div className="text-cream font-semibold">{item.name as string}</div>
                <div className="text-dark-500 text-xs">{item.role as string}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blog Preview ─────────────────────────────────────────────────────────────

function BlogSection({ posts }: { posts: Record<string, unknown>[] }) {
  const { t } = useLang();

  const placeholders = [
    { id: '1', title: '5 Mindset Shifts That Will Change Everything', category: 'Mindset', readTime: '5 min', createdAt: new Date() },
    { id: '2', title: 'How to Build Unshakeable Confidence', category: 'Confidence', readTime: '7 min', createdAt: new Date() },
    { id: '3', title: 'The Science of Habit Formation', category: 'Habits', readTime: '6 min', createdAt: new Date() },
  ];

  const displayPosts = posts.length > 0 ? posts : placeholders;

  return (
    <section className="section-padding bg-dark-950">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-16">
          <AnimSection>
            <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">{t('section.blog')}</div>
            <h2 className="font-display text-5xl text-cream">Latest Insights</h2>
          </AnimSection>
          <Link href="/blog" className="hidden sm:flex items-center gap-2 text-gold-400 text-sm hover:text-gold-300 transition-colors group">
            All Articles <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayPosts.slice(0, 3).map((p: Record<string, unknown>, i) => (
            <motion.div
              key={(p.id as string) || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link href={`/blog/${p.id}`} className="block group border border-dark-800 hover:border-gold-700 transition-all duration-300 p-6">
                <div className="text-gold-500 text-xs tracking-wider uppercase mb-3">{p.category as string}</div>
                <h3 className="font-display text-xl text-cream group-hover:text-gold-400 transition-colors mb-4 leading-snug">{p.title as string}</h3>
                <div className="flex items-center gap-4 text-dark-500 text-xs">
                  <span>{p.readTime as string} read</span>
                  <span className="flex items-center gap-1 text-gold-500 group-hover:translate-x-1 transition-transform">
                    Read <FiArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

function CTASection() {
  const { t } = useLang();

  return (
    <section className="section-padding bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-900/10 via-transparent to-gold-900/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
      </div>

      <div className="container-custom relative text-center">
        <AnimSection>
          <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-6">Take the First Step</div>
          <h2 className="font-display text-6xl sm:text-7xl text-cream mb-6">
            Your Transformation<br />
            <span className="text-gold-gradient italic">Starts Today</span>
          </h2>
          <p className="text-dark-300 max-w-xl mx-auto mb-10">
            Whether you're ready for 1:1 coaching or want to start with a course — your best self is waiting. Let's make it happen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/coaching" className="btn-gold group">
              Book a Coaching Session <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/courses" className="btn-outline group">
              Browse Courses <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </AnimSection>
      </div>
    </section>
  );
}

// ─── AI Chat Widget ───────────────────────────────────────────────────────────

function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm Heba's AI assistant. How can I help you today? I can suggest courses, answer questions, or help you book a coaching session." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 bg-gold-500 text-dark-950 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-gold-900/30 transition-all duration-300 hover:scale-110 hover:bg-gold-400"
        aria-label="AI Chat"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-44 right-6 z-50 w-80 sm:w-96 bg-dark-900 border border-dark-700 shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: '480px' }}
          >
            <div className="bg-dark-800 px-4 py-3 border-b border-dark-700 flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="text-cream text-sm font-semibold">Ask Heba AI</div>
                <div className="text-dark-400 text-xs">Always here to help</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-dark-400 text-xs">Online</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: '320px' }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gold-600 text-dark-950'
                      : 'bg-dark-800 text-dark-200 border border-dark-700'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-dark-800 border border-dark-700 px-3 py-2">
                    <span className="flex gap-1">
                      {[0,1,2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-dark-700 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask me anything..."
                className="flex-1 bg-dark-800 border border-dark-600 text-cream placeholder-dark-500 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="bg-gold-500 text-dark-950 px-4 py-2 text-sm font-bold hover:bg-gold-400 transition-colors disabled:opacity-50"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([]);
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    getCourses().then(setCourses).catch(() => {});
    getTestimonials().then(setTestimonials).catch(() => {});
    getLatestPosts().then(setPosts).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <CoursesSection courses={courses} />
        <TestimonialsSection testimonials={testimonials} />
        <BlogSection posts={posts} />
        <CTASection />
      </main>
      <Footer />
      <AIChatWidget />
    </>
  );
}
