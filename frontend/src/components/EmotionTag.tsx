import { type Emotion, emotionEmojis } from '@/lib/mockData';

interface EmotionTagProps {
  emotion: Emotion;
  confidence?: number;
  size?: 'sm' | 'md';
}

const emotionBgClasses: Record<Emotion, string> = {
  joy: 'bg-emotion-joy/20 text-accent-foreground',
  sadness: 'bg-emotion-sadness/20 text-foreground',
  anger: 'bg-emotion-anger/20 text-foreground',
  fear: 'bg-emotion-fear/20 text-foreground',
  surprise: 'bg-emotion-surprise/20 text-accent-foreground',
  love: 'bg-emotion-love/20 text-foreground',
  neutral: 'bg-emotion-neutral/20 text-foreground',
};

const EmotionTag = ({ emotion, confidence, size = 'md' }: EmotionTagProps) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${emotionBgClasses[emotion]} ${sizeClasses}`}>
      <span>{emotionEmojis[emotion]}</span>
      <span className="capitalize">{emotion}</span>
      {confidence !== undefined && (
        <span className="text-muted-foreground">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </span>
  );
};

export default EmotionTag;
