import { type Sentiment } from '@/lib/mockData';

const sentimentStyles: Record<Sentiment, string> = {
  Positive: 'bg-secondary text-secondary-foreground',
  Neutral: 'bg-muted text-muted-foreground',
  Negative: 'bg-destructive/10 text-destructive',
};

const sentimentIcons: Record<Sentiment, string> = {
  Positive: '✨',
  Neutral: '➖',
  Negative: '🌧️',
};

const SentimentBadge = ({ sentiment }: { sentiment: Sentiment }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${sentimentStyles[sentiment]}`}>
    <span>{sentimentIcons[sentiment]}</span>
    {sentiment}
  </span>
);

export default SentimentBadge;
