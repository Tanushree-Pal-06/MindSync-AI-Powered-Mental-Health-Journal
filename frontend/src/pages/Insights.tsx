import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { trendData, sentimentDistribution, mockEntries, emotionEmojis } from '@/lib/mockData';
import type { Emotion } from '@/lib/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const emotionFrequency: { name: string; count: number; gradientId: string }[] = [
  { name: 'Joy', count: 5, gradientId: 'gradJoy' },
  { name: 'Sadness', count: 3, gradientId: 'gradSadness' },
  { name: 'Anger', count: 1, gradientId: 'gradAnger' },
  { name: 'Neutral', count: 2, gradientId: 'gradNeutral2' },
  { name: 'Love', count: 3, gradientId: 'gradLove' },
  { name: 'Surprise', count: 2, gradientId: 'gradSurprise' },
];

// Find most frequent emotion
const allEmotions = mockEntries.flatMap((e) => e.emotions);
const emotionCounts: Record<string, number> = {};
allEmotions.forEach((e) => {
  emotionCounts[e.name] = (emotionCounts[e.name] || 0) + 1;
});
const mostFrequent = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];

const Insights = () => {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Emotional Insights</h1>
        <p className="mb-8 text-muted-foreground">Discover patterns in your emotional journey.</p>
      </motion.div>

      {/* Key Patterns */}
      <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-calm rounded-xl p-5 text-center">
          <span className="text-3xl">{emotionEmojis[mostFrequent[0] as Emotion]}</span>
          <p className="mt-2 text-sm text-muted-foreground">Most Frequent Emotion</p>
          <p className="text-lg font-semibold capitalize text-foreground">{mostFrequent[0]}</p>
        </div>
        <div className="card-calm rounded-xl p-5 text-center">
          <span className="text-3xl">📊</span>
          <p className="mt-2 text-sm text-muted-foreground">Weekly Mood</p>
          <p className="text-lg font-semibold text-foreground">Mostly Positive</p>
        </div>
        <div className="card-calm rounded-xl p-5 text-center">
          <span className="text-3xl">🔥</span>
          <p className="mt-2 text-sm text-muted-foreground">Best Streak</p>
          <p className="text-lg font-semibold text-foreground">7 Days</p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Emotion Trend Line */}
        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="card-calm rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Sentiment Over Time</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <defs>
                <linearGradient id="gradLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="gradLineDot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.8rem' }} />
              <Line type="monotone" dataKey="sentiment" stroke="url(#gradLine)" strokeWidth={3} dot={{ r: 5, fill: 'url(#gradLineDot)', stroke: '#7c3aed', strokeWidth: 1 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sentiment Distribution Pie */}
        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="card-calm rounded-xl p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Sentiment Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <defs>
                <linearGradient id="gradPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="gradNeutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="gradNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <Pie data={sentimentDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {sentimentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Emotion Frequency Bar */}
        <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="card-calm rounded-xl p-6 md:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Emotion Frequency</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={emotionFrequency}>
              <defs>
                <linearGradient id="gradJoy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="gradSadness" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="gradAnger" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="gradNeutral2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="gradLove" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
                <linearGradient id="gradSurprise" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.8rem' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {emotionFrequency.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={`url(#${entry.gradientId})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Insights;
