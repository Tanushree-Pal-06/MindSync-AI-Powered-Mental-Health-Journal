import sqlite3
import pandas as pd
import matplotlib.pyplot as plt

# Connect to SQLite and load data
conn = sqlite3.connect('diary.db')
query = """
SELECT posted_at, emotion
FROM entries
"""
df = pd.read_sql_query(query, conn)

# Count emotions per day
trend = df.groupby(['posted_at', 'emotion']).size().reset_index(name='count')

# Pivot for plotting
pivot = trend.pivot(index='posted_at', columns='emotion', values='count').fillna(0)

# Plot
pivot.plot(figsize=(10, 5), title='Emotion Trends Over Time')
plt.xlabel('Date')
plt.ylabel('Count')
plt.grid(True)
plt.show()

# Count emotions
emotion_counts = df['emotion'].value_counts()

# Plot
emotion_counts.plot(kind='bar', color=['#FFC1CC', "#BEEC7E", '#C8E7ED',"#8EE3F2", '#BBD0FF', "#FFAEA1"])
plt.title('Total Emotion Counts')
plt.xlabel('Emotion')
plt.ylabel('Frequency')
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.tight_layout()
plt.show()

# Pie chart
colors = ["#6BECF1", '#C8FFD4', '#FFD6A5','#FFB5A7', '#BBD0FF', "#D9CFA3"]
emotion_counts.plot(kind='pie', autopct='%1.1f%%', startangle=140, colors=colors)
plt.title('Emotion Distribution')
plt.ylabel('')  # Hide y-label
plt.tight_layout()
plt.show()