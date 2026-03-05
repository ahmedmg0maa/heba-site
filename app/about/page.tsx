'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const milestones = [
  { year: '2012', event: 'Began coaching practice after earning Psychology degree' },
  { year: '2015', event: 'Became ICF Certified Professional Coach' },
  { year: '2017', event: 'Published first book — "The Mindset Revolution"' },
  { year: '2019', event: 'Reached 100+ coaching clients, launched first online course' },
  { year: '2021', event: 'TEDx Talk — "The Architecture of Personal Change"' },
  { year: '2023', event: 'Launched flagship coaching platform & community' },
];

const values = [
  { icon: '🎯', title: 'Purposeful Growth', desc: 'Every step you take should move you closer to your authentic vision.' },
  { icon: '💡', title: 'Evidence-Based', desc: 'Combining psychology, neuroscience, and real-world results.' },
  { icon: '🤝', title: 'Genuine Connection', desc: 'Real coaching requires real presence, not cookie-cutter scripts.' },
  { icon: '✨', title: 'Lasting Transformation', desc: 'We go beyond surface change to create deep, sustainable shifts.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-dark-950">
        {/* Hero */}
        <section className="min-h-[70vh] flex items-center relative pt-32 pb-16 overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gold-900/5 rounded-full blur-3xl -translate-y-1/2" />
          <div className="container-custom relative">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">My Story</div>
              <h1 className="font-display text-7xl text-cream mb-6 leading-none">
                About<br /><span className="text-gold-gradient italic">Heba</span>
              </h1>
              <p className="text-dark-300 text-xl max-w-xl leading-relaxed">
                A coach, educator, author, and speaker on a mission to help people discover their full potential and live with intention.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bio */}
        <section className="section-padding bg-dark-900">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="aspect-[3/4] bg-dark-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-40 h-40 rounded-full bg-gold-600/20 border-2 border-gold-600/40 flex items-center justify-center mx-auto mb-4">
                      <span className="font-display text-7xl text-gold-400">H</span>
                    </div>
                    <p className="text-dark-500 text-sm">Heba — Professional Coach</p>
                  </div>
                </div>
                <div className="absolute inset-6 border border-gold-800/20 pointer-events-none" />
              </div>

              <div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  <p className="text-dark-200 text-lg leading-relaxed mb-5">
                    I didn't start as a coach. I started as someone who was lost — struggling with confidence, clarity, and purpose. It was only through years of deep inner work, academic study, and working with mentors that I discovered the frameworks that would later transform my clients' lives.
                  </p>
                  <p className="text-dark-300 leading-relaxed mb-5">
                    Today, I blend evidence-based psychology with practical coaching techniques to help professionals, entrepreneurs, and individuals break through their limitations and create the lives they've always known were possible.
                  </p>
                  <p className="text-dark-300 leading-relaxed mb-8">
                    Whether you're looking for a radical life change or steady, purposeful growth — my work meets you exactly where you are.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'ICF Certified Coach',
                      'M.A. Psychology',
                      '500+ Clients',
                      'TEDx Speaker',
                      'Published Author',
                      '10+ Years Experience',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2 text-sm text-dark-300">
                        <FiCheck className="text-gold-500 shrink-0" size={14} />
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-dark-950">
          <div className="container-custom">
            <div className="text-center mb-16">
              <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">What I Stand For</div>
              <h2 className="font-display text-5xl text-cream">My Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-dark p-8 text-center"
                >
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-display text-xl text-cream mb-3">{v.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding bg-dark-900">
          <div className="container-custom max-w-3xl">
            <div className="text-center mb-16">
              <div className="text-gold-500 text-xs tracking-[0.3em] uppercase mb-4">The Journey</div>
              <h2 className="font-display text-5xl text-cream">Milestones</h2>
            </div>
            <div className="relative">
              <div className="absolute left-24 top-0 bottom-0 w-px bg-gradient-to-b from-gold-800/40 via-gold-600/20 to-transparent" />
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex gap-8 mb-8 items-start relative"
                >
                  <div className="w-16 text-right shrink-0">
                    <span className="font-display text-gold-500">{m.year}</span>
                  </div>
                  <div className="w-3 h-3 bg-gold-500 rounded-full mt-1.5 shrink-0 relative z-10" />
                  <p className="text-dark-300 leading-relaxed">{m.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-dark-950 text-center">
          <div className="container-custom">
            <h2 className="font-display text-5xl text-cream mb-4">Ready to Work Together?</h2>
            <p className="text-dark-300 max-w-lg mx-auto mb-8">Your transformation story starts with a single conversation.</p>
            <Link href="/coaching" className="btn-gold inline-flex group">
              Book a Session <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
