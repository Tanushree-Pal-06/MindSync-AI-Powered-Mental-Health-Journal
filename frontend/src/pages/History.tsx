import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar } from 'lucide-react';
import EmotionTag from '@/components/EmotionTag';

interface Entry {
  id: number;
  entry: string;
  emotion: string;
  posted_at: string;
}

const History = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:5000/getEntry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("History Data:", data);
        setEntries(data.entries || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

  }, []);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">
          Journal History
        </h1>

        <p className="mb-8 text-muted-foreground">
          Look back on your reflections and emotional journey.
        </p>
      </motion.div>

      <div className="space-y-4">

        {loading ? (
          <div className="rounded-xl border border-border p-8 text-center">
            Loading entries...
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-xl border border-border p-8 text-center">
            <p className="text-lg font-medium text-foreground">
              No journal entries yet ✨
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Start writing your first reflection today.
            </p>
          </div>
        ) : (
          entries.map((entry, i) => {
            const isExpanded = expandedId === entry.id;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-calm-hover cursor-pointer rounded-xl"
                onClick={() =>
                  setExpandedId(isExpanded ? null : entry.id)
                }
              >
                <div className="flex items-start justify-between p-5">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />

                      <span className="text-sm font-medium text-muted-foreground">
                        {new Date(entry.posted_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className={`text-sm text-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {entry.entry}
                    </p>
                  </div>

                  <ChevronDown
                    className={`ml-4 mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
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
                        <p className="mb-3 text-sm font-medium text-muted-foreground">
                          Detected Emotion
                        </p>

                        <EmotionTag
                          emotion={entry.emotion as any}
                          confidence={1}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;