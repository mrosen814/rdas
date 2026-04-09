'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const STORAGE_KEY = 'rdas_auth';


// ─── Hero illustration ───────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <Image
        src="/images/rdas-hero-illustration.png"
        alt="Family struggling to decide what to cook for dinner, representing dinner planning frustration"
        width={800}
        height={600}
        className="w-full h-auto rounded-2xl"
        priority
      />
    </div>
  );
}


// ─── Section helpers ─────────────────────────────────────────────────────────

function PainPoint({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-2xl p-8 flex flex-col gap-6">
      <span className="text-5xl">{icon}</span>
      <p className="text-white text-xl font-semibold leading-snug">{text}</p>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-4xl font-black text-stone-200 select-none">{num}</div>
      <h3 className="text-base font-bold text-stone-900">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-sm font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setAuthenticated(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  const openModal = useCallback(() => {
    setShowModal(true);
    setError('');
    setPassword('');
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setError('');
    setPassword('');
  }, []);

  useEffect(() => {
    if (!showModal) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showModal, closeModal]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1');
      setAuthenticated(true);
      setShowModal(false);
    } else {
      setError('Incorrect password.');
      setPassword('');
    }
  }

  // Avoid flash: render nothing until localStorage has been checked
  if (authenticated === null) return null;
  if (authenticated) return <>{children}</>;

  return (
    <>
      <div className="min-h-screen bg-white text-stone-900">

        {/* ── NAV ────────────────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-30 bg-white border-b border-stone-100 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex flex-col leading-tight">
              <span className="font-black text-red-600 tracking-wide text-4xl">R-DAS</span>
              <span className="text-xs text-stone-400 font-medium tracking-normal">Rosen Dinner Allocation System</span>
            </div>
            <button
              onClick={openModal}
              className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
            >
              Already have access?
            </button>
          </div>
        </nav>

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section className="px-6 pt-20 pb-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide uppercase">
              Family dinner planning · Simplified
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-stone-900 leading-[1.05] mb-6">
              Decide what's for dinner.<br />Plan the week in minutes.
            </h1>
            <p className="text-lg sm:text-xl text-stone-500 leading-relaxed mb-10 max-w-xl mx-auto">
              R-DAS helps families choose meals faster, rediscover favourites, and take the stress out of dinner planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                className="bg-stone-900 hover:bg-stone-700 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors cursor-not-allowed opacity-90"
                title="Coming soon"
              >
                Get early access
              </button>
              <a
                href="#how-it-works"
                className="text-stone-500 hover:text-stone-800 font-medium px-8 py-3.5 rounded-xl text-sm transition-colors"
              >
                See how it works ↓
              </a>
            </div>
            <HeroIllustration />
          </div>
        </section>

        {/* ── PROBLEM ────────────────────────────────────────────────────── */}
        <section className="bg-stone-900 text-white px-6 py-20 mt-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-center mb-3">Sound familiar?</h2>
            <p className="text-stone-400 text-center text-base mb-12">
              The nightly dinner question is surprisingly exhausting.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PainPoint icon="🕔" text="It's 5pm. Nobody can agree on what to cook, and takeaway feels like giving up." />
              <PainPoint icon="🧠" text="Planning a week of dinners takes far more mental energy than it should." />
              <PainPoint icon="🤔" text="You keep forgetting about meals the whole family actually loves." />
              <PainPoint icon="📋" text="It's hard to keep track of what worked, what didn't, and what's worth making again." />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
        <section id="how-it-works" className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-center mb-3">How it works</h2>
            <p className="text-stone-500 text-center text-base mb-16">
              Three steps to a calmer dinner week.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
              <Step
                num="01"
                title="Build your family's meal library"
                desc="Add the dinners your family loves. Rate them, tag them, and keep notes on what worked. It's your collection — not a generic recipe app."
              />
              <Step
                num="02"
                title="Plan the week in minutes"
                desc="Drop meals into your week planner. R-DAS shows what you've made recently so you don't accidentally repeat yourself."
              />
              <Step
                num="03"
                title="Rediscover what you've been missing"
                desc="See which meals haven't made an appearance in a while. Great dinners deserve more than one showing."
              />
            </div>
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────────────── */}
        <section className="bg-stone-50 px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-center mb-3">Everything your family needs</h2>
            <p className="text-stone-500 text-center text-base mb-16">
              No extra complexity. Just what actually matters.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FeatureCard
                icon="🍽️"
                title="What's for dinner tonight?"
                desc="R-DAS surfaces meals based on what you've made recently, so suggestions stay fresh and nothing gets forgotten."
              />
              <FeatureCard
                icon="📅"
                title="Week planner"
                desc="Plan a full week of dinners in one clean view. Slot meals into any day and adjust as the week unfolds."
              />
              <FeatureCard
                icon="🔄"
                title="Rotation awareness"
                desc="See at a glance how long it's been since you last made each dish. No more accidental pasta three weeks running."
              />
              <FeatureCard
                icon="💡"
                title="Rediscover favourites"
                desc="Your best meals shouldn't gather dust. R-DAS highlights dishes that haven't appeared in a while and deserve a comeback."
              />
            </div>
          </div>
        </section>

        {/* ── BUILT FOR FAMILIES ─────────────────────────────────────────── */}
        <section className="px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-4xl mb-6">🏡</div>
            <h2 className="text-3xl font-black mb-5">Built for real families</h2>
            <p className="text-stone-500 text-base leading-relaxed">
              R-DAS started as a solution to a very familiar problem: the same conversation, every single evening.{' '}
              <em className="text-stone-700">"What's for dinner?"</em> We built it for our own family — to reduce the
              decision fatigue, make the most of meals we already love, and stop the guesswork. It's been part of our
              routine ever since.
            </p>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="bg-red-600 px-6 py-20 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-black mb-4">Ready to sort dinner?</h2>
            <p className="text-red-100 text-base leading-relaxed mb-10">
              Join the waitlist and be among the first families to try R-DAS.
            </p>
            <button
              type="button"
              className="bg-white text-red-600 font-bold px-10 py-4 rounded-xl text-sm hover:bg-red-50 transition-colors cursor-not-allowed"
              title="Coming soon"
            >
              Join the waitlist
            </button>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <footer className="px-6 py-10 border-t border-stone-100">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-black text-red-600 tracking-wide">R-DAS</span>
              <span className="text-xs text-stone-400">Rosen Dinner Allocation System</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-stone-400">
              <span>© {new Date().getFullYear()} Rosen</span>
              <button
                onClick={openModal}
                className="text-stone-400 hover:text-stone-700 transition-colors underline underline-offset-2"
              >
                Already have access? →
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* ── PASSWORD MODAL ─────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-red-600 tracking-wide">R-DAS</h2>
              <p className="text-sm text-stone-500 mt-1">Enter your access password</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                autoComplete="current-password"
                autoFocus
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                Enter
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors text-center pt-1"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
