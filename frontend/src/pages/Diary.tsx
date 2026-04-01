import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import EmotionTag from '@/components/EmotionTag';
import SentimentBadge from '@/components/SentimentBadge';
import type { Emotion, Sentiment } from '@/lib/mockData';

interface AnalysisResult {
  sentiment: Sentiment;
  emotions: { name: Emotion; confidence: number }[];
}

const Diary = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 1500));

    setResult({
      sentiment: 'Positive',
      emotions: [
        { name: 'joy', confidence: 0.78 },
        { name: 'love', confidence: 0.42 },
        { name: 'surprise', confidence: 0.15 },
      ],
    });
    setIsAnalyzing(false);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Write Your Thoughts</h1>
        <p className="mb-6 text-muted-foreground">Take a moment to reflect on your day. Your words stay private.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="card-calm rounded-2xl p-6"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write about your day..."
          className="min-h-[220px] w-full resize-none rounded-xl border border-border bg-background p-4 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{text.length} characters</span>
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse-soft" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Analyze Emotion
              </>
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 card-calm rounded-2xl p-6"
          >
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Analysis Results</h2>

            <div className="mb-5">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Overall Sentiment</p>
              <SentimentBadge sentiment={result.sentiment} />
            </div>

            <div className="mb-5">
              <p className="mb-3 text-sm font-medium text-muted-foreground">Detected Emotions</p>
              <div className="flex flex-wrap gap-2">
                {result.emotions.map((e) => (
                  <EmotionTag key={e.name} emotion={e.name} confidence={e.confidence} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">Confidence Levels</p>
              <div className="space-y-3">
                {result.emotions.map((e) => (
                  <div key={e.name} className="flex items-center gap-3">
                    <span className="w-20 text-sm capitalize text-foreground">{e.name}</span>
                    <div className="flex-1 overflow-hidden rounded-full bg-muted h-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${e.confidence * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {Math.round(e.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Diary;
