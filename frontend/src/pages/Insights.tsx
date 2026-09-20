  import { motion } from 'framer-motion';
  import { useNavigate } from "react-router-dom";
  import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
  } from 'recharts';
  import { useEffect, useState } from "react";
  import { emotionEmojis } from "@/lib/mockData";
  import type { Emotion } from "@/lib/mockData";

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
  };




  const Insights = () => {
    const navigate = useNavigate();
  const [trendData, setTrendData] = useState<any[]>([]);
  const [sentimentDistribution, setSentimentDistribution] = useState<any[]>([]);
  const [emotionFrequency, setEmotionFrequency] = useState<any[]>([]);
  const [mostFrequent, setMostFrequent] = useState<any>(["neutral",0]);
  const [weeklyMood, setWeeklyMood] = useState("Neutral");
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {

    const userId = localStorage.getItem("user_id");

    if(!userId) return;

    fetch(`${import.meta.env.VITE_API_URL}/insights`,{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        user_id:Number(userId)
      })

    })

    .then(res=>res.json())

    .then(data=>{


      
      setTrendData(data.trendData || []);

      setSentimentDistribution(data.sentimentDistribution || []);

      setEmotionFrequency(data.emotionFrequency || []);

      setWeeklyMood(data.weeklyMood || "Neutral");

      setBestStreak(data.bestStreak || 0);

      if(data.mostFrequentEmotion){

        setMostFrequent([
          data.mostFrequentEmotion,
          0
        ]);

      }

    })

    .catch(console.error);

  },[]);

  return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
          <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Emotional Insights</h1>
          <p className="mb-8 text-muted-foreground">Discover patterns in your emotional journey.</p>
        </motion.div>

        {/* Key Patterns */}
        <motion.div initial="hidden" animate="visible" custom={1} variants={fadeUp} className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card-calm rounded-xl p-5 text-center">
            <span className="text-3xl">{emotionEmojis[(mostFrequent[0] || "neutral") as Emotion]}</span>
            <p className="mt-2 text-sm text-muted-foreground">Most Frequent Emotion</p>
            <p className="text-lg font-semibold capitalize text-foreground">{mostFrequent[0] || "Neutral"}</p>
          </div>
          <div className="card-calm rounded-xl p-5 text-center">
            <span className="text-3xl">📊</span>
            <p className="mt-2 text-sm text-muted-foreground">Weekly Mood</p>
            <p className="text-lg font-semibold text-foreground">{weeklyMood}</p>
          </div>
          <div className="card-calm rounded-xl p-5 text-center">
            <span className="text-3xl">🔥</span>
            <p className="mt-2 text-sm text-muted-foreground">Best Streak</p>
            <p className="text-lg font-semibold text-foreground">{bestStreak} Days</p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Emotion Trend Line */}
          <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="card-calm rounded-xl p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Sentiment Over Time</h2>
            {trendData.length === 0 ? (
  <div className="flex h-[240px] flex-col items-center justify-center text-center">
    <p className="text-base font-semibold text-white">
      No entries yet
    </p>

    <p className="mt-2 text-sm text-white/70">
      Your sentiment trend will appear here as you continue journaling.
    </p>
  </div>
) : (
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

      <CartesianGrid
        strokeDasharray="3 3"
        stroke="hsl(var(--border))"
      />

      <XAxis
        dataKey="date"
        tick={{
          fontSize: 11,
          fill: 'hsl(var(--muted-foreground))'
        }}
      />

      <YAxis
        tick={{
          fontSize: 11,
          fill: 'hsl(var(--muted-foreground))'
        }}
      />

      <Tooltip
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '0.5rem',
          fontSize: '0.8rem'
        }}
      />

      <Line
        type="monotone"
        dataKey="sentiment"
        stroke="url(#gradLine)"
        strokeWidth={3}
        dot={{
          r: 5,
          fill: 'url(#gradLineDot)',
          stroke: '#7c3aed',
          strokeWidth: 1
        }}
      />
    </LineChart>
  </ResponsiveContainer>
)}
          </motion.div>

          {/* Sentiment Distribution Pie */}
          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="card-calm rounded-xl p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Sentiment Distribution This Week</h2>
           <ResponsiveContainer width="100%" height={240}>
  {sentimentDistribution.every((entry) => entry.value === 0) ? (
    <div className="flex h-full flex-col items-center justify-center">
     <div className="relative flex h-[170px] w-[170px] items-center justify-center rounded-full border-[18px] border-gray-500/40">
        <div className="text-center">
          <p className="font-display text-m font-bold text-white">
            No Data for this week
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        No diary entries this week yet
      </p>
    </div>
  ) : (
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

      <Pie
        data={sentimentDistribution}
        cx="60%"
        cy="50%"
        innerRadius={55}
        outerRadius={85}
        paddingAngle={4}
        dataKey="value"
        label={({ name, percent, value }) =>
          value > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
        }
      >
        {sentimentDistribution.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Pie>

      <Tooltip />
    </PieChart>
  )}
</ResponsiveContainer>
          </motion.div>

          {/* Emotion Frequency Bar */}
          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="card-calm rounded-xl p-6 md:col-span-2">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Emotion Frequency</h2>
            {emotionFrequency.length === 0 ? (
  <div className="flex h-[240px] flex-col items-center justify-center text-center">
    <p className="text-base font-semibold text-white">
      No emotions recorded yet
    </p>

    <p className="mt-2 text-sm text-white/70">
      Start journaling to discover the emotions that appear most often.
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
    <BarChart data={emotionFrequency}>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="hsl(var(--border))"
      />

      <XAxis
        dataKey="name"
        interval={0}
        angle={-35}
        textAnchor="end"
        height={70}
        tick={{
          fontSize: 12,
          fill: "hsl(var(--muted-foreground))",
        }}
      />

      <YAxis
        tick={{
          fontSize: 12,
          fill: 'hsl(var(--muted-foreground))'
        }}
      />

      <Tooltip
        contentStyle={{
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '0.5rem',
          fontSize: '0.8rem'
        }}
      />

      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
        {emotionFrequency.map((entry, index) => (
          <Cell
            key={index}
            fill={`hsl(${(index * 47) % 360}, 70%, 55%)`}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)}
          </motion.div>
        </div>
      </div>
    );
  };

  export default Insights;
