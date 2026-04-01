export type Emotion = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'love' | 'neutral';
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export interface DiaryEntry {
  id: string;
  date: string;
  text: string;
  sentiment: Sentiment;
  emotions: { name: Emotion; confidence: number }[];
}

export const emotionColors: Record<Emotion, string> = {
  joy: 'bg-emotion-joy',
  sadness: 'bg-emotion-sadness',
  anger: 'bg-emotion-anger',
  fear: 'bg-emotion-fear',
  surprise: 'bg-emotion-surprise',
  love: 'bg-emotion-love',
  neutral: 'bg-emotion-neutral',
};

export const emotionEmojis: Record<Emotion, string> = {
  joy: '😊',
  sadness: '😢',
  anger: '😠',
  fear: '😰',
  surprise: '😲',
  love: '❤️',
  neutral: '😐',
};

export const mockEntries: DiaryEntry[] = [
  {
    id: '1',
    date: '2026-03-24',
    text: 'Had an amazing day at the park with friends. The weather was perfect and we played frisbee for hours. Feeling grateful for the little moments.',
    sentiment: 'Positive',
    emotions: [
      { name: 'joy', confidence: 0.85 },
      { name: 'love', confidence: 0.45 },
      { name: 'surprise', confidence: 0.12 },
    ],
  },
  {
    id: '2',
    date: '2026-03-23',
    text: 'Work was stressful today. Too many meetings and I couldn\'t focus on my actual tasks. Need to find better ways to manage my time.',
    sentiment: 'Negative',
    emotions: [
      { name: 'anger', confidence: 0.55 },
      { name: 'sadness', confidence: 0.35 },
      { name: 'fear', confidence: 0.2 },
    ],
  },
  {
    id: '3',
    date: '2026-03-22',
    text: 'Spent a quiet evening reading a new book. Nothing particularly exciting happened, but it was peaceful and calm.',
    sentiment: 'Neutral',
    emotions: [
      { name: 'neutral', confidence: 0.7 },
      { name: 'joy', confidence: 0.2 },
    ],
  },
  {
    id: '4',
    date: '2026-03-21',
    text: 'Got some unexpected good news about a project I\'d applied for! Can\'t believe it worked out. Feeling on top of the world.',
    sentiment: 'Positive',
    emotions: [
      { name: 'joy', confidence: 0.9 },
      { name: 'surprise', confidence: 0.75 },
      { name: 'love', confidence: 0.15 },
    ],
  },
  {
    id: '5',
    date: '2026-03-20',
    text: 'Missing my family a lot today. Haven\'t visited them in a while. Made a plan to call them this weekend.',
    sentiment: 'Negative',
    emotions: [
      { name: 'sadness', confidence: 0.65 },
      { name: 'love', confidence: 0.55 },
    ],
  },
  {
    id: '6',
    date: '2026-03-19',
    text: 'Tried a new recipe for dinner and it turned out really well. Small wins feel great sometimes.',
    sentiment: 'Positive',
    emotions: [
      { name: 'joy', confidence: 0.7 },
      { name: 'surprise', confidence: 0.3 },
    ],
  },
  {
    id: '7',
    date: '2026-03-18',
    text: 'Just an ordinary day. Went through my routine, nothing out of the ordinary. Felt balanced and steady.',
    sentiment: 'Neutral',
    emotions: [
      { name: 'neutral', confidence: 0.8 },
    ],
  },
];

export const trendData = [
  { date: 'Mar 18', joy: 30, sadness: 10, anger: 5, neutral: 80, sentiment: 50 },
  { date: 'Mar 19', joy: 70, sadness: 5, anger: 0, neutral: 20, sentiment: 75 },
  { date: 'Mar 20', joy: 15, sadness: 65, anger: 10, neutral: 10, sentiment: 25 },
  { date: 'Mar 21', joy: 90, sadness: 5, anger: 0, neutral: 5, sentiment: 90 },
  { date: 'Mar 22', joy: 20, sadness: 10, anger: 5, neutral: 70, sentiment: 50 },
  { date: 'Mar 23', joy: 10, sadness: 35, anger: 55, neutral: 10, sentiment: 20 },
  { date: 'Mar 24', joy: 85, sadness: 5, anger: 0, neutral: 10, sentiment: 85 },
];

export const sentimentDistribution = [
  { name: 'Positive', value: 4, fill: 'url(#gradPositive)' },
  { name: 'Neutral', value: 2, fill: 'url(#gradNeutral)' },
  { name: 'Negative', value: 1, fill: 'url(#gradNegative)' },
];
