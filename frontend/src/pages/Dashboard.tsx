import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Flame,
  BookOpen,
  TrendingUp,
  Heart,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

interface Entry {
  id: number;
  entry: string;
  emotion: string;
  posted_at: string;
}

interface TrendData {
  date: string;
  joy: number;
  sadness: number;
  anger: number;
  neutral: number;
  love: number;
  surprise: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("name") || "User";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setLoading(false);
      return;
    }

    // Fetch entries
    fetch("http://127.0.0.1:5000/getEntry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(userId),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || []);
      })
      .catch((err) => console.error(err));

    // Fetch trends
    fetch("http://127.0.0.1:5000/getTrends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(userId),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTrendData(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const latestEntry = entries.length > 0 ? entries[0] : null;

  const emotionCount: Record<string, number> = {};

  entries.forEach((item) => {
    const key = item.emotion?.toLowerCase();
    emotionCount[key] = (emotionCount[key] || 0) + 1;
  });

  const topEmotion =
    Object.keys(emotionCount).length > 0
      ? Object.keys(emotionCount).reduce((a, b) =>
          emotionCount[a] > emotionCount[b] ? a : b
        )
      : "neutral";
  const today = new Date();

  const entriesThisWeek = entries.filter((entry) => {
    const entryDate = new Date(entry.posted_at);

    const diff =
      (today.getTime() - entryDate.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff <= 7;
  }).length;
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
        <p className="mb-1 text-sm font-medium text-muted-foreground">
          Welcome Back, {username} ✨
        </p>

        <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
          How are you feeling today?
        </h1>

        <p className="text-muted-foreground">
          Reflect, analyze emotions, and grow one entry at a time.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            icon: Flame,
            label: 'Entries This Week',
            value: String(entriesThisWeek),
            color: 'text-orange-500',
          },
          {
            icon: BookOpen,
            label: 'Total Entries',
            value: String(entries.length),
            color: 'text-primary',
          },
          {
            icon: TrendingUp,
            label: 'Latest Mood',
            value: latestEntry?.emotion || 'None',
            color: 'text-green-500',
          },
          {
            icon: Heart,
            label: 'Top Emotion',
            value: topEmotion,
            color: 'text-pink-500',
          },
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
            <p className="text-lg font-semibold capitalize text-foreground">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
      {/* Latest Entry */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={5}
        variants={fadeUp}
        className="card-calm rounded-xl p-6"
      >
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Latest Entry
        </h2>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : latestEntry ? (
          <>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-5">
              {latestEntry.entry}
            </p>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm capitalize text-primary">
              {latestEntry.emotion}
            </span>
          </>
        ) : (
          <div className="flex h-[120px] flex-col items-center justify-center text-center">
            <div className="mb-2 text-2xl">✨</div>

            <p className="text-base font-semibold text-white">
              Your journal is waiting
            </p>

            <p className="mt-1 text-sm text-white/70">
              Write your first thought and start your journey.
            </p>

            <button
              onClick={() => navigate("/diary")}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              Write your first entry →
            </button>
          </div>
        )}
      </motion.div>

        {/* Attractive Real Graph */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={6}
          variants={fadeUp}
          className="card-calm rounded-xl p-6"
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Emotion Trends
          </h2>

          {trendData.length === 0 ? (
  <div className="flex h-[240px] flex-col items-center justify-center text-center">
    <p className="text-base font-medium text-foreground">
      No entries yet
    </p>

    <p className="mt-1 text-sm text-muted-foreground">
      Start journaling to see your emotion trends here.
    </p>

    <button
      onClick={() => navigate("/diary")}
      className="mt-4 text-sm font-medium text-primary hover:underline"
    >
      Start Journaling →
    </button>
  </div>
) : (
  <ResponsiveContainer width="100%" height={240}>
    <LineChart data={trendData}>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="hsl(var(--border))"
      />

      <XAxis
        dataKey="date"
        tick={{
          fontSize: 12,
          fill: 'hsl(var(--muted-foreground))',
        }}
      />

      <YAxis
        tick={{
          fontSize: 12,
          fill: 'hsl(var(--muted-foreground))',
        }}
      />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="joy"
        stroke="#f59e0b"
        strokeWidth={3}
      />

      <Line
        type="monotone"
        dataKey="sadness"
        stroke="#3b82f6"
        strokeWidth={3}
      />

      <Line
        type="monotone"
        dataKey="anger"
        stroke="#ef4444"
        strokeWidth={3}
      />

      <Line
        type="monotone"
        dataKey="neutral"
        stroke="#8b5cf6"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
)}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;