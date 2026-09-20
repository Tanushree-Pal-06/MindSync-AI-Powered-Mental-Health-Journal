import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Mic } from "lucide-react";
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

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceResult, setVoiceResult] = useState<any>(null);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);

  const timerRef = useRef<number | null>(null);

  // ✅ TEXT ANALYSIS
  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setVoiceResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/addEntry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          user_id: parseInt(localStorage.getItem("user_id") || "0"),
        }),
      });

      const data = await response.json();

      setResult({
        sentiment: data.sentiment,
        emotions: data.emotions,
      });
    } catch (error) {
      console.error("Text Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
    const startRecording = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const file = new File(
          [audioBlob],
          "recording.wav",
          {
            type: "audio/wav",
          }
        );

        setAudioFile(file);

        stream.getTracks().forEach(track => track.stop());

      };

      recorder.start();

      setRecordingTime(0);

      setIsRecording(true);

      timerRef.current = window.setInterval(() => {

        setRecordingTime(prev => prev + 1);

      },1000);

    }

    catch(err){

      alert("Microphone permission denied.");

      console.log(err);

    }

  };
  const stopRecording = () => {

  mediaRecorderRef.current?.stop();

  setIsRecording(false);

  if(timerRef.current){

    clearInterval(timerRef.current);

  }

};

  // ✅ VOICE ANALYSIS (FIXED)
  const handleVoiceAnalyze = async () => {
    setResult(null);
    if (!audioFile) {
      alert("Please select a .wav file");
      return;
    }
    

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("user_id", localStorage.getItem("user_id") || "0");

    try {
      setIsVoiceLoading(true);
      setVoiceResult(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/analyze_audio`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Voice Result:", data);

      setVoiceResult(data);

    } catch (error) {
      console.error("Voice Error:", error);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground">
          Write Your Thoughts
        </h1>

        <p className="mb-6 text-muted-foreground">
          Take a moment to reflect on your day. Your words stay private.
        </p>
      </motion.div>

      {/* TEXT CARD (UNCHANGED UI) */}
      <motion.div
        className="card-calm rounded-2xl p-6"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write about your day..."
          className="min-h-[220px] w-full resize-none rounded-xl border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length} characters
          </span>

          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm text-primary-foreground disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
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

      {/* VOICE CARD */}
      {/* VOICE CARD */}
<motion.div className="mt-6 card-calm rounded-2xl p-6">

  <h2 className="mb-2 text-xl font-semibold text-foreground">
    Voice Emotion Analysis
  </h2>

  <p className="mb-6 text-sm text-muted-foreground">
    Record your thoughts and let MindSync analyze both your voice and emotions.
  </p>

  <div className="flex flex-col items-center gap-5">

    {/* Mic Button */}
    {!isRecording ? (

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={startRecording}
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-sky-500
          via-violet-500
          to-purple-600
          shadow-lg
          transition-all
        "
      >
        <Mic className="h-7 w-7 text-white" />
      </motion.button>

    ) : (

      <motion.button
        animate={{
          scale: [1, 1.1, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 1
        }}
        onClick={stopRecording}
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-purple-600
          via-fuchsia-500
          to-sky-500
          shadow-lg
        "
      >
        <div className="h-4 w-4 rounded-sm bg-white" />
      </motion.button>

    )}

    {/* Status */}
    <div className="text-center">

      <p className="font-medium text-foreground">

        {isRecording
          ? "Recording..."
          : audioFile
          ? "Recording Ready ✅"
          : "Tap to start recording"}

      </p>

      {isRecording && (

        <p className="mt-1 text-lg font-semibold text-violet-500">

          {recordingTime}s

        </p>

      )}

    </div>

    {/* Analyze Button */}

    {audioFile && (

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleVoiceAnalyze}
        disabled={isVoiceLoading}
        className="
          rounded-xl
          bg-gradient-to-r
          from-sky-500
          via-violet-500
          to-purple-600
          px-6
          py-2.5
          font-medium
          text-white
          shadow-md
          disabled:opacity-50
        "
      >

        {isVoiceLoading
          ? "Analyzing..."
          : "✨ Analyze Recording"}

      </motion.button>

    )}

  </div>

</motion.div>
{/* VOICE RESULT */}
{voiceResult && (
  <motion.div className="mt-6 card-calm rounded-2xl p-6">

    <h2 className="mb-4 text-xl font-semibold text-foreground">
      Voice Results
    </h2>

    <p className="mb-4">
      <strong>Transcribed:</strong>{" "}
      {voiceResult.transcribed_text}
    </p>

    <p className="mb-3">
      <strong>Sentiment:</strong>{" "}
      <span className="capitalize">
        {voiceResult.sentiment}
      </span>
    </p>

    <div className="mt-4">
      <h3 className="mb-3 text-lg font-semibold text-foreground">
        Detected Emotions
      </h3>

      {voiceResult.emotions?.map((emotion, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 mb-3"
        >
          <span className="capitalize text-foreground">
            {emotion.name}
          </span>

          <span className="font-semibold text-violet-300">
            {(emotion.confidence * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>

    <p className="mt-4 mb-2">
      <strong>Voice Emotion:</strong>{" "}
      <span className="capitalize">
        {voiceResult.voice_emotion}
      </span>
    </p>

    <p>
      <strong>Final Emotion:</strong>{" "}
      <span className="capitalize">
        {voiceResult.final_result}
      </span>
    </p>

  </motion.div>
)}

      {/* TEXT RESULT */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="mt-6 card-calm rounded-2xl p-6"
          >
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Analysis Results
            </h2>

            <SentimentBadge sentiment={result.sentiment} />

            <div className="mt-4 flex flex-wrap gap-2">
              {result.emotions.map((e) => (
                <EmotionTag
                  key={e.name}
                  emotion={e.name}
                  confidence={e.confidence}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Diary;