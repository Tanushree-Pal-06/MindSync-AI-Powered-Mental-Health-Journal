import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, BookOpen, TrendingUp, Heart } from 'lucide-react';
import { trendData, mockEntries, emotionEmojis } from '@/lib/mockData';
import EmotionTag from '@/components/EmotionTag';
import SentimentBadge from '@/components/SentimentBadge';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Dashboard = () => {
  const latestEntry = mockEntries[0];
  const topEmotion = latestEntry.emotions[0];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
        className="mb-8 rounded-2xl p-8 hero-gradient"
      >
        <p className="mb-1 text-sm font-medium text-muted-foreground">March 24, 2026</p>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
          How are you feeling today?
        </h1>
        <p className="text-muted-foreground">
          Track your emotions, understand your patterns, and grow through self-reflection.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: Flame, label: 'Day Streak', value: '7', color: 'text-emotion-surprise' },
          { icon: BookOpen, label: 'Total Entries', value: String(mockEntries.length), color: 'text-primary' },
          { icon: TrendingUp, label: 'Sentiment', value: latestEntry.sentiment, color: 'text-secondary-foreground' },
          { icon: Heart, label: 'Top Emotion', value: `${emotionEmojis[topEmotion.name]} ${topEmotion.name}`, color: 'text-emotion-love' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            animate="visible"
            custom={i + 1}
            variants={fadeUp}
            className="card-calm rounded-xl p-4"
          >
            <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-semibold capitalize text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Entry + Chart */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeUp}
          className="card-calm rounded-xl p-6"
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Latest Entry</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {latestEntry.text}
          </p>
          <div className="mb-3">
            <SentimentBadge sentiment={latestEntry.sentiment} />
          </div>
          <div className="flex flex-wrap gap-2">
            {latestEntry.emotions.map((e) => (
              <EmotionTag key={e.name} emotion={e.name} confidence={e.confidence} size="sm" />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={6}
          variants={fadeUp}
          className="card-calm rounded-xl p-6"
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Emotion Trends</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                }}
              />
              <Line type="monotone" dataKey="joy" stroke="hsl(var(--emotion-joy))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sadness" stroke="hsl(var(--emotion-sadness))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="anger" stroke="hsl(var(--emotion-anger))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="neutral" stroke="hsl(var(--emotion-neutral))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
