import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Sparkles } from 'lucide-react';
import { useAIFriend } from './AIFriendContext';
import { createPortal } from "react-dom";
type Msg = { id: number; role: 'user' | 'ai'; text: string };

const INITIAL: Msg[] = [
  {
    id: 1,
    role: 'ai',
    text: "Hi, I'm your AI Friend 💜 I'm here to listen — how are you feeling right now?",
  },
];

const AIFriendChat = () => {
  const { open, setOpen } = useAIFriend();
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  useEffect(() => {

    if(open){

        document.body.style.overflow="hidden";

    }else{

        document.body.style.overflow="auto";

    }

    return ()=>{

        document.body.style.overflow="auto";

    }

},[open]);
  const send = async () => {
  const text = input.trim();

  if (!text) return;

  const userMsg: Msg = {
    id: Date.now(),
    role: "user",
    text,
  };

  setMessages((prev) => [...prev, userMsg]);

  setInput("");

  setTyping(true);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
        message: text,
      }),
    });

    const data = await response.json();

    setTyping(false);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "ai",
        text: data.reply,
      },
    ]);
  } catch (error) {
    console.error(error);

    setTyping(false);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "ai",
        text: "Sorry, I couldn't reach the AI server right now.",
      },
    ]);
  }
};
  return (
    createPortal(
    <AnimatePresence>
        
      {open && (
        <>
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        />
        <motion.div
  initial={{
    opacity: 0,
    x: "-50%",
    y: "-50%",
    scale: 0.95,
  }}
  animate={{
    opacity: 1,
    x: "-50%",
    y: "-50%",
    scale: 1,
  }}
  exit={{
    opacity: 0,
    x: "-50%",
    y: "-50%",
    scale: 0.95,
  }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 24,
  }}
  className="
    fixed
    top-1/2
    left-1/2
    z-[9999]
    w-[92vw]
    max-w-[430px]
    h-[560px]
    max-h-[80vh]
    flex
    flex-col
    rounded-2xl
    border
    border-primary/20
    bg-card/95
    backdrop-blur-xl
    shadow-2xl
    overflow-hidden
  "
  style={{
    boxShadow: "0 20px 60px -10px hsl(var(--primary) / 0.35)",
  }}
>
          {/* Header */}
          <div className="relative flex items-center gap-3 border-b border-border/60 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/10 px-4 py-3">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400 text-white shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-400" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-display text-sm font-semibold text-foreground">AI Friend</h3>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online · here for you
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'rounded-br-md bg-primary text-primary-foreground'
                        : 'rounded-bl-md bg-muted/70 text-foreground'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted/70 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-primary/70"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Input */}
          <div className="border-t border-border/60 bg-background/60 p-3">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Share what's on your mind…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                type="button"
                aria-label="Voice input (coming soon)"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={send}
                disabled={!input.trim()}
                aria-label="Send"
                className="rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1.5 text-white shadow-md transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
        </>
      )}
      
    </AnimatePresence>,
    document.body)
  );
};
export default AIFriendChat;