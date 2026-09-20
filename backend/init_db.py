import sqlite3

conn = sqlite3.connect('diary.db')
cur = conn.cursor()

# 1. Existing entries table
cur.execute('''
    CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        entry TEXT, 
        emotion TEXT,
        posted_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
''')

# 2. NEW: Chat history table for the chatbot
cur.execute('''
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        role TEXT, -- 'user' or 'assistant'
        message TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )
''')

conn.commit()
conn.close()
print("Database initialized successfully with chat_messages table!")