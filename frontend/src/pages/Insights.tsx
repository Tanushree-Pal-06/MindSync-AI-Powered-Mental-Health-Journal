import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Brain, Activity, PieChart as PieIcon } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

const Insights = () => {
  const [trendData, setTrendData] = useState<any[]>([]);
  const [emotionCounts, setEmotionCounts] = useState<any[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/insights")
      .then((res) => res.json())
      .then((data) => {
        setTrendData(data.trendData);
        setEmotionCounts(data.emotionCounts);
        setEmotionDistribution(data.emotionDistribution);
      })
      .catch((err) => console.error(err));
  }, []);

  const totalEntries = emotionCounts.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const topEmotion =
    emotionCounts.length > 0
      ? emotionCounts.reduce((a, b) =>
          a.count > b.count ? a : b
        ).emotion
      : "None";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">

      {/* HEADER */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
          Emotional Insights
        </h1>

        <p className="mt-2 text-muted-foreground text-lg">
          Beautiful analytics from your real journal data.
        </p>
      </motion.div>

      {/* TOP STATS */}
      <div className="grid gap-5 md:grid-cols-3 mb-8">

        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-xl"
        >
          <Brain className="mb-3 h-7 w-7 text-violet-500" />
          <p className="text-sm text-muted-foreground">
            Total Entries
          </p>
          <h2 className="text-3xl font-bold mt-1">
            {totalEntries}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-xl"
        >
          <Activity className="mb-3 h-7 w-7 text-cyan-500" />
          <p className="text-sm text-muted-foreground">
            Top Emotion
          </p>
          <h2 className="text-3xl font-bold mt-1 capitalize">
            {topEmotion}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-xl"
        >
          <PieIcon className="mb-3 h-7 w-7 text-emerald-500" />
          <p className="text-sm text-muted-foreground">
            Unique Emotions
          </p>
          <h2 className="text-3xl font-bold mt-1">
            {emotionCounts.length}
          </h2>
        </motion.div>

      </div>

      {/* CHARTS */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* LINE CHART */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-xl"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Emotion Trends Over Time
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="posted_at" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* PIE */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeUp}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-xl"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Emotion Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionDistribution}
                dataKey="count"
                nameKey="emotion"
                outerRadius={105}
                innerRadius={55}
                label
              >
                {emotionDistribution.map(
                  (_: any, index: number) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* BAR */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={6}
          variants={fadeUp}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-xl md:col-span-2"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Total Emotion Counts
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={emotionCounts}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="emotion" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="count"
                radius={[10, 10, 0, 0]}
              >
                {emotionCounts.map(
                  (_: any, index: number) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

      </div>
    </div>
  );
};

export default Insights;