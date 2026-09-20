export interface SuggestionItem {
  title: string;
  description: string;
  icon: string;
}

export interface WeeklyInsights {
  positive: number;
  mixed: number;
  negative: number;
}

export interface SuggestionsResponse {
  mood_summary: string;
  suggestions: SuggestionItem[];
  weekly_insights: WeeklyInsights;
  encouragement: string;
}

const MOCK: SuggestionsResponse = {
  mood_summary:
    "Your recent entries reflect a mostly positive week with a few stressful moments. You've shown resilience and gratitude in your reflections.",
  suggestions: [
    {
      title: "Stress Management",
      description: "Try a 5-minute box breathing exercise when work feels overwhelming.",
      icon: "wind",
    },
    {
      title: "Better Sleep Habits",
      description: "Wind down 30 minutes before bed with no screens — your mind will thank you.",
      icon: "moon",
    },
    {
      title: "Mindfulness Practice",
      description: "A short morning meditation can ground your day before it begins.",
      icon: "brain",
    },
    {
      title: "Physical Activity",
      description: "A 20-minute walk outdoors lifts mood and clears mental fog.",
      icon: "activity",
    },
    {
      title: "Social Connection",
      description: "Reach out to a loved one this week — small calls build big comfort.",
      icon: "users",
    },
    {
      title: "Positive Reflection",
      description: "Write three things you're grateful for tonight before sleep.",
      icon: "heart",
    },
  ],
  weekly_insights: { positive: 5, mixed: 2, negative: 1 },
  encouragement:
    "You're moving forward — even quiet steps count. Keep tending to your inner world; it's listening back.",
};

export async function fetchSuggestions(): Promise<SuggestionsResponse> {

  const user_id = Number(localStorage.getItem("user_id"));

  const res = await fetch("http://127.0.0.1:5000/suggestions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
    }),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return await res.json();
}