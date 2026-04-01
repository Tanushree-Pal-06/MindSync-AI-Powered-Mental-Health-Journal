import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar } from 'lucide-react';
import { mockEntries } from '@/lib/mockData';
import EmotionTag from '@/components/EmotionTag';
import SentimentBadge from '@/components/SentimentBadge';

const History = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">Journal History</h1>
        <p className="mb-8 text-muted-foreground">Look back on your reflections and emotional journey.</p>
      </motion.div>

      <div className="space-y-4">
        {mockEntries.map((entry, i) => {
          const isExpanded = expandedId === entry.id;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card-calm-hover cursor-pointer rounded-xl"
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
            >
              <div className="flex items-start justify-between p-5">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                    <SentimentBadge sentiment={entry.sentiment} />
                  </div>
                  <p className={`text-sm text-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {entry.text}
                  </p>
                </div>
                <ChevronDown
                  className={`ml-4 mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-5 pb-5 pt-4">
                      <p className="mb-3 text-sm font-medium text-muted-foreground">Detected Emotions</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.emotions.map((e) => (
                          <EmotionTag key={e.name} emotion={e.name} confidence={e.confidence} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
