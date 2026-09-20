import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Wind, Moon, Brain, Activity, Users, Heart,
  AlertCircle, Inbox, LucideIcon, Quote, MessageCircleHeart,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchSuggestions, SuggestionsResponse } from '@/lib/suggestionsApi';
import { useAIFriend } from '@/components/AI Friend';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const iconMap: Record<string, LucideIcon> = {
  wind: Wind,
  moon: Moon,
  brain: Brain,
  activity: Activity,
  users: Users,
  heart: Heart,
  sparkles: Sparkles,
};

const Suggestions = () => {
  const [data, setData] = useState<SuggestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchSuggestions()
      .then(setData)
      .catch((e) => setError(e?.message ?? 'Something went wrong'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
        <div className="mb-2 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="font-display text-3xl font-bold text-foreground">Personalized Suggestions</h1>
        </div>
        <p className="mb-8 text-muted-foreground">
          Gentle recommendations crafted from your recent diary entries and emotional trends.
        </p>
      </motion.div>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && data && (data.suggestions?.length ? <Content data={data} /> : <EmptyState />)}
    </div>
  );
};

const Content = ({ data }: { data: SuggestionsResponse }) => {
  const { setOpen } = useAIFriend();
  const weeklyData = [
    { name: 'Positive', count: data.weekly_insights.positive, fill: 'url(#sugGradPositive)' },
    { name: 'Mixed', count: data.weekly_insights.mixed, fill: 'url(#sugGradMixed)' },
    { name: 'Negative', count: data.weekly_insights.negative, fill: 'url(#sugGradNegative)' },
  ];

  return (
    <div className="space-y-6">
      {/* A. Mood Summary */}
      <motion.section initial="hidden" animate="visible" custom={1} variants={fadeUp}
        className="card-calm rounded-xl p-6">
        <h2 className="mb-2 font-display text-lg font-semibold text-foreground">Mood Summary</h2>
        <p className="leading-relaxed text-muted-foreground">{data.mood_summary}</p>
      </motion.section>

      {/* B. Personalized Suggestions */}
      <motion.section initial="hidden" animate="visible" custom={2} variants={fadeUp}>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">For You This Week</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.suggestions.map((s, i) => {
            const Icon = iconMap[s.icon?.toLowerCase()] ?? Sparkles;
            return (
              <motion.div
                key={`${s.title}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.45 }}
                className="card-calm-hover group rounded-xl p-5"
              >
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/30 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* C. Weekly Insights */}
      <motion.section initial="hidden" animate="visible" custom={3} variants={fadeUp}
        className="card-calm rounded-xl p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Weekly Insights</h2>

        <div className="mb-6 grid grid-cols-3 gap-3">
          {weeklyData.map((w) => (
            <div key={w.name} className="rounded-lg border border-border bg-muted/30 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{w.name}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-foreground">{w.count}</p>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <defs>
              <linearGradient id="sugGradPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="sugGradMixed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="sugGradNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.8rem' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {weeklyData.map((entry, index) => (
                <Cell key={`sug-bar-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.section>

      {/* D. Encouragement */}
      <motion.section initial="hidden" animate="visible" custom={4} variants={fadeUp}
        className="relative overflow-hidden rounded-xl border border-primary/20 p-6"
        style={{ background: 'var(--gradient-calm)' }}
      >
        <Quote className="absolute right-5 top-5 h-10 w-10 text-primary/20" />
        <h2 className="mb-2 font-display text-lg font-semibold text-foreground">A Note for You</h2>
        <p className="max-w-2xl text-base italic leading-relaxed text-foreground/85">
          “{data.encouragement}”
        </p>
      </motion.section>

      {/* E. Talk to AI Friend */}
      <motion.section
        initial="hidden" animate="visible" custom={5} variants={fadeUp}
        className="relative overflow-hidden rounded-2xl border border-primary/25 p-8 text-center"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.25), transparent 55%), radial-gradient(circle at 80% 80%, hsl(var(--accent) / 0.25), transparent 55%), hsl(var(--card))',
        }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400 text-white shadow-lg"
        >
          <MessageCircleHeart className="h-7 w-7" />
        </motion.div>
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Need someone to talk to?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Your AI Friend is always here to listen, encourage you, and help you process your
          thoughts without judgment.
        </p>
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #06b6d4 100%)',
            boxShadow: '0 10px 30px -5px hsl(var(--primary) / 0.55)',
          }}
        >
          💜 Talk to AI Friend
        </motion.button>
      </motion.section>
    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-6">
    <div className="card-calm rounded-xl p-6">
      <Skeleton className="mb-3 h-5 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card-calm rounded-xl p-5">
          <Skeleton className="mb-3 h-11 w-11 rounded-xl" />
          <Skeleton className="mb-2 h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="mt-1.5 h-3 w-4/5" />
        </div>
      ))}
    </div>
    <div className="card-calm rounded-xl p-6">
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className="card-calm flex flex-col items-center rounded-xl p-10 text-center">
    <AlertCircle className="mb-3 h-10 w-10 text-destructive" />
    <h3 className="font-display text-lg font-semibold text-foreground">We couldn't load your suggestions</h3>
    <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
    <button
      onClick={onRetry}
      className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Try again
    </button>
  </motion.div>
);

const EmptyState = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className="card-calm flex flex-col items-center rounded-xl p-10 text-center">
    <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />
    <h3 className="font-display text-lg font-semibold text-foreground">No suggestions yet</h3>
    <p className="mt-1 max-w-md text-sm text-muted-foreground">
      Write a few diary entries this week and your personalized recommendations will appear here.
    </p>
  </motion.div>
);

export default Suggestions;