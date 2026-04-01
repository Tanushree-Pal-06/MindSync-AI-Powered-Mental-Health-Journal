import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  PenLine, Brain, BarChart3, Shield, Lock, Sparkles,
  Heart, Flame, ChevronRight, Eye, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/mindsync-logo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const TypingHero = () => {
  const phrases = [
    'Today I feel… overwhelmed',
    'Today I feel… grateful',
    'Today I feel… anxious',
    'Today I feel… hopeful',
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    const timeout = deleting ? 30 : 60;

    const timer = setTimeout(() => {
      if (!deleting && charIdx < phrase.length) {
        setCharIdx(charIdx + 1);
      } else if (!deleting && charIdx === phrase.length) {
        setTimeout(() => setDeleting(true), 1800);
      } else if (deleting && charIdx > 14) {
        setCharIdx(charIdx - 1);
      } else if (deleting) {
        setDeleting(false);
        setPhraseIdx((phraseIdx + 1) % phrases.length);
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, phraseIdx]);

  return (
    <div className="landing-glass-card mx-auto max-w-lg rounded-2xl px-6 py-5">
      <div className="mb-2 flex items-center gap-2 text-xs text-landing-muted">
        <span className="h-2 w-2 rounded-full bg-green-400/80" />
        AI Journal Active
      </div>
      <p className="font-mono text-base text-landing-text/90 md:text-lg">
        {phrases[phraseIdx].slice(0, charIdx)}
        <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-landing-accent" />
      </p>
      {charIdx === phrases[phraseIdx].length && !deleting && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 rounded-lg bg-landing-accent/10 px-3 py-2 text-xs text-landing-accent"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Emotion detected — generating reflection…
        </motion.div>
      )}
    </div>
  );
};

const steps = [
  { icon: PenLine, title: 'Write your thoughts', desc: 'Express yourself freely in a safe, private space.' },
  { icon: Brain, title: 'AI analyzes emotions', desc: 'Our AI detects patterns and emotions in your writing.' },
  { icon: BarChart3, title: 'Get insights & reflections', desc: 'Receive personalized insights to understand yourself.' },
];

const features = [
  { icon: Heart, title: 'Emotion Detection', desc: 'Visual emotion indicators with color-coded mood tags and confidence scores.' },
  { icon: BarChart3, title: 'Mood Analytics', desc: 'Beautiful dashboards showing trends, patterns, and emotional growth over time.' },
  { icon: Sparkles, title: 'AI Reflection Companion', desc: 'Thoughtful AI-generated reflections that help you see perspectives you might miss.' },
  { icon: Flame, title: 'Streak Tracking', desc: 'Build consistency with daily journaling streaks and gentle reminders.' },
];

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="landing-page min-h-screen bg-landing-bg text-landing-text">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute -right-32 top-0 h-[600px] w-[600px] rounded-full bg-blue-600/8 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/6 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-white/5 bg-landing-bg/70 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="MindSync AI" className="h-9 w-9 rounded-xl object-contain" />
            <span className="text-lg font-semibold text-landing-text">MindSync AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="border border-white/10 text-landing-muted hover:bg-white/5 hover:text-landing-text"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              className="bg-landing-accent text-white hover:bg-landing-accent/90"
              asChild
            >
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center"
      >
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-landing-accent/20 bg-landing-accent/10 px-4 py-1.5 text-xs font-medium text-landing-accent">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Self-Reflection
          </span>
        </motion.div>
        <motion.h1
          initial="hidden" animate="visible" custom={1} variants={fadeUp}
          className="mb-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-landing-text md:text-6xl lg:text-7xl"
        >
          Write what you feel.{' '}
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Understand what you don't.
          </span>
        </motion.h1>
        <motion.p
          initial="hidden" animate="visible" custom={2} variants={fadeUp}
          className="mb-10 max-w-xl text-base leading-relaxed text-landing-muted md:text-lg"
        >
          An AI-powered journal that helps you reflect, analyze, and grow — privately and effortlessly.
        </motion.p>
        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="mb-14 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-landing-accent px-8 text-white hover:bg-landing-accent/90" asChild>
            <Link to="/diary">Start Journaling <ChevronRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="ghost" className="border border-white/10 text-landing-muted hover:bg-white/5 hover:text-landing-text" asChild>
            <a href="#how-it-works"><Eye className="mr-2 h-4 w-4" /> See How It Works</a>
          </Button>
        </motion.div>
        <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="w-full max-w-2xl">
          <TypingHero />
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 md:py-32">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            custom={0} variants={fadeUp}
            className="mb-16 text-center"
          >
            <h2 className="mb-3 font-display text-3xl font-bold text-landing-text md:text-4xl">How It Works</h2>
            <p className="text-landing-muted">Three simple steps to emotional clarity.</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                custom={i + 1} variants={fadeUp}
                className="landing-glass-card group rounded-2xl p-6 text-center transition-all hover:border-landing-accent/20"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-landing-accent/10 text-landing-accent transition-colors group-hover:bg-landing-accent/20">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-landing-accent">Step {i + 1}</div>
                <h3 className="mb-2 text-lg font-semibold text-landing-text">{step.title}</h3>
                <p className="text-sm leading-relaxed text-landing-muted">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            custom={0} variants={fadeUp}
            className="mb-16 text-center"
          >
            <h2 className="mb-3 font-display text-3xl font-bold text-landing-text md:text-4xl">
              Tools for your inner world
            </h2>
            <p className="text-landing-muted">Everything you need for meaningful self-reflection.</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                custom={i + 1} variants={fadeUp}
                className="landing-glass-card group flex gap-4 rounded-2xl p-6 transition-all hover:border-landing-accent/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-landing-accent/10 text-landing-accent transition-colors group-hover:bg-landing-accent/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-semibold text-landing-text">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-landing-muted">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            custom={0} variants={fadeUp}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-landing-accent/10">
              <Lock className="h-7 w-7 text-landing-accent" />
            </div>
            <h2 className="mb-3 font-display text-3xl font-bold text-landing-text md:text-4xl">
              Your thoughts stay yours. Always.
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-landing-muted">
              We believe your inner world deserves the highest level of privacy. Your journal entries are encrypted
              and never shared — because self-reflection should feel safe.
            </p>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            custom={1} variants={fadeUp}
            className="flex flex-wrap justify-center gap-6"
          >
            {[
              { icon: Shield, text: 'End-to-end encrypted' },
              { icon: Lock, text: 'Private by default' },
              { icon: Eye, text: 'No data selling, ever' },
            ].map((item) => (
              <div key={item.text} className="landing-glass-card flex items-center gap-3 rounded-xl px-5 py-3">
                <item.icon className="h-4 w-4 text-landing-accent" />
                <span className="text-sm text-landing-text">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            custom={0} variants={fadeUp}
          >
            <BookOpen className="mx-auto mb-6 h-10 w-10 text-landing-accent/60" />
            <h2 className="mb-4 font-display text-3xl font-bold text-landing-text md:text-4xl">
              Start understanding yourself,{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                one entry at a time.
              </span>
            </h2>
            <p className="mb-8 text-landing-muted">
              Join thousands who journal with intention. It only takes a moment to begin.
            </p>
            <Button size="lg" className="bg-landing-accent px-10 text-white hover:bg-landing-accent/90" asChild>
              <Link to="/diary">Start Journaling Now <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <img src={logo} alt="MindSync AI" className="h-6 w-6 rounded-lg object-contain" />
            <span className="text-sm text-landing-muted">MindSync AI © 2026</span>
          </div>
          <p className="text-xs text-landing-muted/50">A peaceful, intelligent space that listens without judgment.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
