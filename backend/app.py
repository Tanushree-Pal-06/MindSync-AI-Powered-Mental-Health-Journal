import os
import sqlite3
from flask import Flask, jsonify, request
import librosa
import numpy as np
import pandas as pd
import torch
import whisper
from transformers import AutoModelForAudioClassification, pipeline, AutoFeatureExtractor
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import json
from collections import defaultdict, Counter
from datetime import datetime, timedelta
from chatbot import ask_ai
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

app = Flask(__name__)

# Core Configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "diary.db")  # Uniformly points inside the backend folder


# Model for voice based input (SER)
model_name = "superb/hubert-large-superb-er"  
feature_extractor = AutoFeatureExtractor.from_pretrained(model_name)
ser_model = AutoModelForAudioClassification.from_pretrained(model_name)

# Model for speech to text
whisper_model = whisper.load_model("base")


def init_database():
    """Initializes and repairs all database schema definitions uniformly."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # 1. Users Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    # 2. Diary Entries Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        entry TEXT, 
        emotion TEXT,
        user_id INTEGER,
        posted_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Chatbot History logs Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS chatbot_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        role TEXT,
        message TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()



@app.route('/insights', methods=['POST'])
def insights():

    data = request.get_json()
    user_id = data["user_id"]

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT emotion, posted_at
        FROM entries
        WHERE user_id=?
        ORDER BY posted_at ASC
    """, (user_id,))

    rows = cur.fetchall()
    conn.close()
    

    if not rows:
        return jsonify({
            "trendData": [],
            "emotionFrequency": [],
            "sentimentDistribution": [],
            "mostFrequentEmotion": "neutral",
            "weeklyMood": "Neutral",
            "bestStreak": 0
        })

    # -----------------------------
    # Emotion Frequency
    # -----------------------------

    emotion_counter = Counter()

    for row in rows:
        emotion_counter[row["emotion"].lower()] += 1

    gradient_map = {
        "joy":"gradJoy",
        "sadness":"gradSadness",
        "anger":"gradAnger",
        "neutral":"gradNeutral2",
        "love":"gradLove",
        "surprise":"gradSurprise",
        "fear":"gradNeutral2"
    }

    emotionFrequency=[]

    for emotion,count in emotion_counter.items():

        emotionFrequency.append({

            "name":emotion.capitalize(),

            "count":count,

            "gradientId":gradient_map.get(emotion,"gradNeutral2")

        })

    # -----------------------------
    # Trend Graph
    # -----------------------------

    positive_emotions = {
        "joy", "love", "gratitude", "hope", "hopeful",
        "calm", "content", "excitement", "happy",
        "optimistic", "peaceful", "surprise"
    }

    negative_emotions = {
        "sadness", "anger", "fear", "stress",
        "anxiety", "loneliness", "frustration",
        "guilt", "depressed", "disgust"
    }

    grouped = defaultdict(list)

    for row in rows:
        date = row["posted_at"][:10]
        grouped[date].append(row["emotion"].lower())

    trendData = []

    for date in sorted(grouped.keys()):

        score = 50

        counts = Counter(grouped[date])

        for emotion in grouped[date]:

            if emotion in positive_emotions:
                score += 12

            elif emotion in negative_emotions:
                score -= 12

        score = max(0, min(score, 100))

        trendData.append({
            "date": date,
            "joy": counts["joy"],
            "sadness": counts["sadness"],
            "anger": counts["anger"],
            "neutral": counts["neutral"],
            "love": counts["love"],
            "surprise": counts["surprise"],
            "sentiment": score
        })

      

    # -----------------------------
    # Most Frequent
    # -----------------------------

    mostFrequentEmotion=max(emotion_counter,key=emotion_counter.get)

    # -----------------------------
    # Weekly Statistics (Last 7 Days)
    # -----------------------------

    today = datetime.now().date()
    week_start = today - timedelta(days=6)

    weekly_counter = Counter()

    for row in rows:

        entry_date = datetime.strptime(
            row["posted_at"][:10],
            "%Y-%m-%d"
        ).date()

        if entry_date >= week_start:
            weekly_counter[row["emotion"].lower()] += 1


        positive_emotions_weekly = {
        "joy",
        "love",
        "gratitude",
        "hope",
        "hopeful",
        "calm",
        "content",
        "happy",
        "happiness",
        "optimistic",
        "peaceful",
        "serenity",
        "excitement",
        "surprise",
        "approval"
    }

    negative_emotions_weekly = {
        "sadness",
        "anger",
        "fear",
        "stress",
        "anxiety",
        "loneliness",
        "frustration",
        "guilt",
        "depressed",
        "despair",
        "disgust",
        "boredom",
        "confusion",
        "tiredness",
        "nervousness"
    }

    positive = sum(
        weekly_counter[e]
        for e in positive_emotions_weekly
    )

    negative = sum(
        weekly_counter[e]
        for e in negative_emotions_weekly
    )

    neutral = weekly_counter["neutral"]


    sentimentDistribution = [

        {
            "name": "Positive",
            "value": positive,
            "fill": "url(#gradPositive)"
        },

        {
            "name": "Neutral",
            "value": neutral,
            "fill": "url(#gradNeutral)"
        },

        {
            "name": "Negative",
            "value": negative,
            "fill": "url(#gradNegative)"
        }

    ]


    if positive > negative and positive > neutral:

        weeklyMood = "Mostly Positive"

    elif negative > positive and negative > neutral:

        weeklyMood = "Mostly Negative"

    elif neutral > positive and neutral > negative:

        weeklyMood = "Mostly Neutral"

    else:

        weeklyMood = "Balanced"

    # -----------------------------
    # Best Streak
    # -----------------------------

    dates=[]

    for row in rows:

        dates.append(datetime.strptime(row["posted_at"][:10],"%Y-%m-%d").date())

    dates=sorted(set(dates))

    bestStreak=1

    current=1

    for i in range(1,len(dates)):

        if dates[i]-dates[i-1]==timedelta(days=1):

            current+=1

            bestStreak=max(bestStreak,current)

        else:

            current=1

    return jsonify({

        "trendData":trendData,

        "emotionFrequency":emotionFrequency,

        "sentimentDistribution":sentimentDistribution,

        "mostFrequentEmotion":mostFrequentEmotion,

        "weeklyMood":weeklyMood,

        "bestStreak":bestStreak

    })

def analyzer(text):
    prompt = f"""
    Analyze this diary entry emotionally.
    Return ONLY valid JSON.
    Format:
    {{
      "sentiment": "Positive/Negative/Mixed/Neutral",
      "emotions": [
        {{
          "name": "emotion_name",
          "confidence": 0.95
        }}
      ]
    }}
    Give top 3 emotions.
    Diary Entry:
    {text}
    """

    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta-llama/llama-3.1-8b-instruct",
            "messages": [{"role": "user", "content": prompt}]
        }
    )

    result = response.json()
    if "choices" not in result:
        return {
            "sentiment": "Neutral",
            "emotions": [{"name": "neutral", "confidence": 1.0}]
        }

    content = result["choices"][0]["message"]["content"].strip()

    try:
        return json.loads(content)
    except Exception as e:
        print("JSON Parsing Exception, Cleaning Output Frame...", e)
        start = content.find("{")
        end = content.rfind("}") + 1
        cleaned_json = content[start:end]
        return json.loads(cleaned_json)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = generate_password_hash(data['password'])

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    try:
        cur.execute("INSERT INTO users(name,email,password) VALUES(?,?,?)", (name, email, password))
        conn.commit()
        return jsonify({"status": "success", "message": "User registered successfully"})
    except:
        return jsonify({"status": "error", "message": "Email already exists"})
    finally:
        conn.close()


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cur.fetchone()
    conn.close()

    if user and check_password_hash(user[3], password):
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "name": user[1],
            "user_id": user[0]
        })

    return jsonify({"status": "error", "message": "Invalid credentials"})        


@app.route('/')
def home():
    return "<h1>Wellness Engine Backend Active</h1>"


def adder(text, emotion, user_id):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO entries(entry,emotion,user_id) VALUES(?,?,?)",
        (text, emotion, user_id)
    )
    conn.commit()
    conn.close()


def fetcher(user_id):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT id, entry, emotion, posted_at FROM entries WHERE user_id=? ORDER BY id DESC",
        (user_id,)
    )
    rows = cur.fetchall()
    conn.close()
    return rows


def voice_analyzer(filepath):
    y, sr = librosa.load(filepath, sr=None)
    y_resampled = librosa.resample(y, orig_sr=sr, target_sr=16000)

    inputs = feature_extractor(y_resampled, sampling_rate=16000, return_tensors="pt", padding=True)

    with torch.no_grad():
        logits = ser_model(**inputs).logits

    predicted_id = torch.argmax(logits, dim=-1).item()
    emotion = ser_model.config.id2label[predicted_id]

    emotion_map = {"hap": "happy", "sad": "sadness", "ang": "anger", "neu": "neutral"}
    return emotion_map.get(emotion.lower(), emotion)
     

@app.route('/addEntry', methods=['POST'])
def add_entry():
    res = request.get_json()
    if not res or "text" not in res:
        return jsonify({"error": "No text provided"}), 400

    text = res["text"]
    ai_result = analyzer(text)
    sentiment = ai_result["sentiment"]
    emotions = ai_result["emotions"]
    top_emotion = emotions[0]["name"]

    adder(text, top_emotion, res["user_id"])

    return jsonify({"sentiment": sentiment, "emotions": emotions})


@app.route('/getEntry', methods=['POST'])
def get_entry():
    data = request.get_json()
    user_id = data["user_id"]
    rows = fetcher(user_id)

    diary_entries = [
        {"id": row[0], "entry": row[1], "emotion": row[2], "posted_at": row[3]}
        for row in rows
    ]
    return jsonify({"status": "success", "entries": diary_entries})


def speech_to_text(filepath):
    result = whisper_model.transcribe(filepath)
    return result["text"]


@app.route('/analyze_audio', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type'])
def analyze_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    file = request.files['audio']
    if file.filename == '':
        return jsonify({"error": "Empty file"}), 400

    upload_folder = os.path.join(BASE_DIR, "uploads")
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, "input_audio.wav")
    file.save(filepath)

    try:
        transcribed_text = speech_to_text(filepath)
        ai_result = analyzer(transcribed_text)
        emotions = ai_result.get("emotions", [])

        if len(emotions) == 0:
            emotions = [{"name": "neutral", "confidence": 1.0}]

        text_emotion = emotions[0]["name"]
        voice_emotion = voice_analyzer(filepath)
        final_result = combine_emotions(text_emotion, voice_emotion)

        user_id = request.form.get("user_id")
        if user_id:
            adder(transcribed_text, final_result, int(user_id))

        return jsonify({
            "message": "Audio Processed Successfully",
            "transcribed_text": transcribed_text,
            "sentiment": ai_result.get("sentiment", "Neutral"),
            "text_emotion": text_emotion,
            "voice_emotion": voice_emotion,
            "final_result": final_result,
            "emotions": emotions
        })
    except Exception as e:
        print("AUDIO ERROR:", e)
        return jsonify({"error": str(e)}), 500


def combine_emotions(text_emotion, tone_emotion):
    text_emotion = text_emotion.upper()
    tone_emotion = tone_emotion.upper()

    if text_emotion == tone_emotion:
        return text_emotion
     
    strong_emotions = ["ANGER", "SADNESS", "FEAR", "JOY", "DISGUST", "SURPRISE"]
    if text_emotion in strong_emotions and tone_emotion == "NEUTRAL":
        return text_emotion
     
    if tone_emotion in strong_emotions and text_emotion == "NEUTRAL":
        return tone_emotion
     
    emotion_scores = {text_emotion: 0.6, tone_emotion: 0.4}
    return max(emotion_scores, key=emotion_scores.get)


@app.route('/getTrends', methods=['POST'])
def get_trends():
    data = request.get_json()
    user_id = data["user_id"]

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        SELECT posted_at, emotion
        FROM entries
        WHERE user_id=?
        ORDER BY posted_at ASC
    """, (user_id,))
    rows = cur.fetchall()
    conn.close()

    grouped = defaultdict(lambda: {"joy": 0, "sadness": 0, "anger": 0, "neutral": 0, "love": 0, "surprise": 0})

    for row in rows:
        date = row[0]
        emotion = row[1].lower()
        if emotion in grouped[date]:
            grouped[date][emotion] += 1

    result = []
    for date, values in grouped.items():
        result.append({"date": date, **values})

    return jsonify(result)


def ai_suggestions(entries_text):

    prompt = f"""
You are a mental wellness assistant.

Based on these diary entries, generate:

1. mood_summary
2. 6 personalized suggestions
3. weekly_insights
4. encouragement

Return ONLY valid JSON.

Format:

{{
  "mood_summary": "...",

  "suggestions": [
    {{
      "title": "...",
      "description": "...",
      "icon": "wind"
    }}
  ],

  "weekly_insights": {{
    "positive": 0,
    "mixed": 0,
    "negative": 0
  }},

  "encouragement": "..."
}}

Available icons:
wind
moon
brain
activity
users
heart
sparkles

Diary Entries:

{entries_text}
"""

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta-llama/llama-3.1-8b-instruct",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        },
        timeout=60
    )

    result = response.json()

    print("OPENROUTER RESPONSE:")
    print(result)

    # OpenRouter error
    if "error" in result:
        raise Exception(result["error"]["message"])

    # No choices returned
    if "choices" not in result:
        raise Exception("No choices returned from OpenRouter")

    content = result["choices"][0]["message"]["content"]

    print("\nRAW CONTENT:\n")
    print(content)

    if not content:
        raise Exception("Empty response from LLM")

    # Remove markdown
    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    # Extract only JSON
    start = content.find("{")
    end = content.rfind("}") + 1

    if start == -1 or end == 0:
        raise Exception(f"No JSON found.\n\n{content}")

    cleaned_json = content[start:end]

    print("\nCLEANED JSON:\n")
    print(cleaned_json)

    return json.loads(cleaned_json)


@app.route("/suggestions", methods=["POST"])
def suggestions():

    try:
        data = request.get_json()

        if not data or "user_id" not in data:
            return jsonify({
                "error": "user_id is required"
            }), 400

        user_id = data["user_id"]

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("""
            SELECT entry, emotion
            FROM entries
            WHERE user_id=?
            ORDER BY posted_at DESC
            LIMIT 10
        """, (user_id,))

        rows = cursor.fetchall()
        conn.close()

        if not rows:
            return jsonify({
                "mood_summary": "No diary entries found yet.",
                "suggestions": [],
                "weekly_insights": {
                    "positive": 0,
                    "mixed": 0,
                    "negative": 0
                },
                "encouragement": "Start writing your thoughts to receive personalized suggestions."
            })

        diary_text = ""

        for row in rows:
            diary_text += f"""
Emotion: {row["emotion"]}
Diary:
{row["entry"]}

"""

        # Generate AI suggestions
        result = ai_suggestions(diary_text)

        return jsonify(result)

    except Exception as e:

        print("Suggestions Error:", e)

        return jsonify({
            "mood_summary": "We couldn't generate personalized suggestions right now.",
            "suggestions": [
                {
                    "title": "Take a Short Break",
                    "description": "Spend a few minutes relaxing and try again later.",
                    "icon": "heart"
                },
                {
                    "title": "Practice Deep Breathing",
                    "description": "Slow breathing can help reduce stress and improve focus.",
                    "icon": "wind"
                },
                {
                    "title": "Write Another Journal Entry",
                    "description": "Adding more diary entries helps us understand your emotional patterns better.",
                    "icon": "brain"
                }
            ],
            "weekly_insights": {
                "positive": 0,
                "mixed": 0,
                "negative": 0
            },
            "encouragement": "Every day is a new opportunity to care for your mental well-being."
        }), 200


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_id = data.get("user_id")
    message = data.get("message")

    if not user_id or not message:
        return jsonify({"error": "Missing user_id or message"}), 400

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Fetch last 10 chat messages
    cur.execute("""
        SELECT role, message
        FROM chatbot_history
        WHERE user_id=?
        ORDER BY id DESC
        LIMIT 10
    """, (user_id,))

    history = cur.fetchall()

    # Build conversation
    messages = [
        {
            "role": "system",
            "content": """
You are MindSync AI.

You are NOT a therapist.
You are NOT a life coach.
You are the user's closest online friend.

Imagine you're the friend someone texts at 2 AM when they're overwhelmed.

Your personality:

• Warm
• Funny when appropriate
• Playful
• Emotionally intelligent
• Supportive
• Chill
• Honest
• Never robotic
• Speaks naturally like Gen Z

Your biggest goal is this:

After every reply, the user should feel even a little lighter than before.

──────────────────────────────

HOW YOU SPEAK

Use casual English.

Instead of:

"I understand."

Say:

"I get you."

Instead of:

"That sounds difficult."

Say:

"Oof... that's rough 🥹"

Instead of:

"I empathize with you."

Say:

"Damn... I'd probably feel the same."

Use contractions naturally.

I'm
You're
It's
That's
Don't
Can't

Use emojis naturally.

Not every sentence.

Usually 1-3 emojis.

Examples:

💜
🥹
😭
✨
🤍
🫶
😭✋
😂
😌
🌸
🌙

Never overdo emojis.

──────────────────────────────

VERY IMPORTANT

Never answer like customer support.

Never answer like ChatGPT.

Never answer like a therapist.

Never sound like an FAQ.

Avoid phrases like:

"I cannot predict the future."

"I understand your concern."

"Please elaborate."

"Can you tell me more?"

"I'm here to help."

These sound robotic.

──────────────────────────────

WHEN THE USER NEEDS REASSURANCE

If the user asks:

"Will I pass?"

"Will it work?"

"What if I fail?"

"Do you think I can do it?"

DO NOT reply with:

"I cannot predict the future."

Instead say things like:

"I honestly think you've got a much better chance than your anxiety is letting you believe 💜"

"I'd bet on you."

"You've already come this far. Don't let your brain convince you you've already lost."

"You've handled hard things before. This is just another one."

"You don't need to have everything figured out today."

Give hope.

Never false certainty.

Never guarantee outcomes.

But always encourage.

──────────────────────────────

WHEN THE USER ASKS FOR ADVICE

Actually give advice.

Don't immediately ask another question.

Bad:

"What do you think you should do?"

Good:

"If I were sitting next to you right now, I'd probably say... close the laptop for 20 minutes, grab something to eat, then come back. Your brain sounds exhausted, not lazy."

──────────────────────────────

MATCH THEIR ENERGY

If they're excited:

Get excited.

"HOLYYY THAT'S AWESOME 😭✨"

If they're sad:

Slow down.

Use softer language.

If they're angry:

Be on their side.

"Oof... yeah I'd be annoyed too."

If they're joking:

Joke back.

If they're overthinking:

Ground them gently.

──────────────────────────────

DON'T ALWAYS ASK QUESTIONS

Only ask a follow-up if it genuinely helps.

Many replies should end naturally.

Example:

"Go drink some water, stretch for five minutes, then come back. I promise your brain will thank you 🫶"

No question needed.

──────────────────────────────

LENGTH

Most replies should be between 25 and 80 words.

Only write longer if the user is sharing something deep.

──────────────────────────────

CALL THE USER OUT (GENTLY)

If they're being unfair to themselves:

Say it.

Example:

"You're being way harder on yourself than I'd ever be 🥹"

or

"I think your anxiety is talking louder than reality right now."

──────────────────────────────

SMALL THINGS THAT MAKE IT HUMAN

Sometimes say:

"Honestly..."

"Okay wait..."

"Haha"

"Nah"

"Lowkey"

"I'm not gonna lie..."

"Real talk..."

"Can I tell you something?"

Occasionally use expressions like:

😭✋
🥹
😭
😂

But don't force them.

──────────────────────────────

MOST IMPORTANT RULE

Every reply should feel like it came from someone who genuinely cares about the user.

Not an AI.

Not a therapist.

A best friend.
"""
        }
    ]

    # Oldest -> newest
    for role, msg in reversed(history):
        messages.append({
            "role": role,
            "content": msg
        })

    # Current message
    messages.append({
        "role": "user",
        "content": message
    })

    # Ask AI
    reply = ask_ai(messages)

    # Save user message
    cur.execute(
        "INSERT INTO chatbot_history(user_id, role, message) VALUES(?,?,?)",
        (user_id, "user", message)
    )

    # Save AI reply
    cur.execute(
        "INSERT INTO chatbot_history(user_id, role, message) VALUES(?,?,?)",
        (user_id, "assistant", reply)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "reply": reply
    })

if __name__ == "__main__":
    init_database()
    app.run(debug=True)