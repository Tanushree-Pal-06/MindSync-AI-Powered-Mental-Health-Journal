import os
import sqlite3
from flask import Flask, jsonify, request
import librosa
import numpy as np
import pandas as pd
import torch
import whisper
from transformers import AutoModelForAudioClassification, pipeline, AutoFeatureExtractor
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app=Flask(__name__)

CORS(app)
# Model for text based input 
classifier=pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base",framework="pt" )

#Model for voice based input(SER)
model_name="superb/hubert-large-superb-er"  
feature_extractor=AutoFeatureExtractor.from_pretrained(model_name)
ser_model=AutoModelForAudioClassification.from_pretrained(model_name)

#model for speech to text
whisper_model=whisper.load_model("base")


def create_users_table():
    conn = sqlite3.connect("diary.db")
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    conn.commit()
    conn.close()

@app.route('/insights', methods=['GET'])
def insights():
    conn = sqlite3.connect('diary.db')

    query = """
    SELECT posted_at, emotion
    FROM entries
    """

    df = pd.read_sql_query(query, conn)
    conn.close()

    if df.empty:
        return jsonify({
            "trendData": [],
            "emotionCounts": [],
            "emotionDistribution": []
        })

    # date only
    df["posted_at"] = pd.to_datetime(df["posted_at"]).dt.date.astype(str)

    # trend graph
    trend = df.groupby(['posted_at', 'emotion']).size().reset_index(name='count')

    trendData = trend.to_dict(orient="records")

    # bar graph
    emotion_counts = df['emotion'].value_counts().reset_index()
    emotion_counts.columns = ['emotion', 'count']

    emotionCounts = emotion_counts.to_dict(orient="records")

    # pie graph same data
    emotionDistribution = emotionCounts

    return jsonify({
        "trendData": trendData,
        "emotionCounts": emotionCounts,
        "emotionDistribution": emotionDistribution
    })

def analyzer(text):
    res = classifier(text)
    print(res)
    return res[0]


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    name = data['name']
    email = data['email']
    password = generate_password_hash(data['password'])

    conn = sqlite3.connect("diary.db")
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users(name,email,password) VALUES(?,?,?)",
            (name, email, password)
        )
        conn.commit()

        return jsonify({
            "status": "success",
            "message": "User registered successfully"
        })

    except:
        return jsonify({
            "status": "error",
            "message": "Email already exists"
        })

    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data['email']
    password = data['password']

    conn = sqlite3.connect("diary.db")
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

    return jsonify({
        "status": "error",
        "message": "Invalid credentials"
    })        

@app.route('/')
def home():
    return "<h1>Welcome</h1>"


def adder(text, emotion, user_id):
     conn=sqlite3.connect('diary.db')
     cur=conn.cursor()

     cur.execute(
         "INSERT INTO entries(entry,emotion,user_id) VALUES(?,?,?)",
         (text, emotion, user_id)
     )

     conn.commit()
     conn.close()


def fetcher():
     conn=sqlite3.connect('diary.db')
     cur=conn.cursor()
     cur.execute('''SELECT * FROM entries ''')
     rows=cur.fetchall()
     conn.close()
     return rows

#voice analyzer function of SER
def voice_analyzer(filepath):
     y, sr = librosa.load(filepath, sr=None)
     y_resampled=librosa.resample(y,orig_sr=sr,target_sr=16000) #resampling

     #feature extraction
     inputs=feature_extractor(
          y_resampled,
          sampling_rate=16000,
          return_tensors="pt",
          padding=True
     )

     # run the model
     with torch.no_grad():
          logits=ser_model(**inputs).logits
             
     predicted_id = torch.argmax(logits, dim=-1).item()
     emotion = ser_model.config.id2label[predicted_id]

     return emotion
     


@app.route('/addEntry', methods=['POST'])
def add_entry():
    res = request.get_json()

    if not res or "text" not in res:
        return jsonify({"error": "No text provided"}), 400

    text = res["text"]

    ai_result = analyzer(text)

    emotion = ai_result["label"]
    confidence = ai_result["score"]

    # sentiment mapping
    if emotion.lower() in ["joy", "love", "surprise"]:
        sentiment = "Positive"
    elif emotion.lower() in ["anger", "sadness", "fear", "disgust"]:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    adder(res["text"], emotion, res["user_id"])

    return jsonify({
        "sentiment": sentiment,
        "emotions": [
            {
                "name": emotion.lower(),
                "confidence": confidence
            }
        ]
    })


@app.route('/getEntry',methods=['POST'])
def get_entry():
      data = request.get_json()
      user_id = data["user_id"]

      rows = fetcher(user_id)

      diary_entries=[
        {
          "id":row[0],
          "entry":row[1],
          "emotion":row[2],
          "posted_at":row[3]
        }
        for row in rows
      ]

      return jsonify({
        "status":"success",
        "entries": diary_entries
      })

# speech to text function
def speech_to_text(filepath):
     result=whisper_model.transcribe(filepath)
     return result["text"]




#voice input feature 
@app.route('/analyze_audio',methods=['POST'])
def analyze_audio():
     #1 .Requesting a file
     file=request.files['audio']
     filepath=os.path.join('uploads','input_audio.wav')
     file.save(filepath)

   # MANUAL FEATURE EXTRACTION (
    #  if  'audio' not in request.files:
    #     return "No file found", 400
    #  return ("Success")

    #  #2. load the file
    #  y, sr = librosa.load('uploads/input_audio.wav', sr=16000)

    #  #3. feature extraction
    #  mfccs=librosa.feature.mfcc(y=y,sr=sr,n_mfcc=13)
    #  mfccs_mean=np.mean(mfccs,axis=1)
    
    #  spec_centroid=librosa.feature.spectral_centroid(y=y,sr=sr)
    #  spec_mean=np.mean(spec_centroid,axis=1)

    #  zcr=librosa.feature.zero_crossing_rate(y=y)
    #  zcr_mean=np.mean(zcr)

    #  rms=librosa.feature.rms(y=y)
    #  rms_mean=np.mean(rms)
     
    #  features = np.hstack([
    #             mfccs_mean,
    #             spec_mean,
    #             zcr_mean,
    #             rms_mean
    #             ])
     
    #  return {"features": features.tolist()})


#USING SER MODEL
     transcribed_text=speech_to_text(filepath)
     text_emotion=analyzer(transcribed_text)
     voice_emotion=voice_analyzer(filepath)
     final_result=combine_emotions(text_emotion,voice_emotion)

     return {
     "message":"Audio Processed Succesfully",
     "transcribed_text":transcribed_text,
     "text_emotion":text_emotion,
     "voice_emotion":voice_emotion,
     "final_result":final_result
    }

# function for combining the emotions into final result
def combine_emotions(text_emotion,tone_emotion):
     text_emotion=text_emotion.upper()
     tone_emotion=tone_emotion.upper()

     if(text_emotion==tone_emotion):
          return text_emotion
     
     strong_emotions=["ANGER", "SADNESS", "FEAR", "JOY", "DISGUST", "SURPRISE"]
     if text_emotion in strong_emotions and tone_emotion=="NEUTRAL":
          return text_emotion
     
     if tone_emotion in strong_emotions and text_emotion=="NEUTRAL":
          return tone_emotion
     
     emotion_scores = {
        text_emotion: 0.6,
        tone_emotion: 0.4
    }
     return max(emotion_scores,key=emotion_scores.get)


if __name__=='__main__':
    create_users_table()
    app.run(debug=True)