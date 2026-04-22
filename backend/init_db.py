import sqlite3

conn=sqlite3.connect('diary.db')

cur=conn.cursor()

cur.execute('''
        CREATE TABLE IF NOT EXISTS entries
             ( id INTEGER PRIMARY KEY AUTOINCREMENT , 
              entry TEXT , 
              emotion TEXT,
              posted_at TEXT DEFAULT CURRENT_TIMESTAMP)
            ''')


cur.execute('''
    ALTER TABLE entries ADD COLUMN emotion TEXT, user_id INTEGER
''')
conn.commit()
conn.close()