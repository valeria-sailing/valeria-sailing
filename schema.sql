-- Run once in Cloudflare D1 SQL console. Do not expose guest data in GitHub.
CREATE TABLE IF NOT EXISTS trips (
 id TEXT PRIMARY KEY, title_de TEXT NOT NULL, title_en TEXT, title_ru TEXT,
 start_date TEXT NOT NULL, end_date TEXT NOT NULL, price_eur INTEGER NOT NULL CHECK(price_eur>=0),
 available_places INTEGER CHECK(available_places BETWEEN 0 AND 4), published INTEGER NOT NULL DEFAULT 1 CHECK(published IN (0,1))
);
CREATE TABLE IF NOT EXISTS requests (
 id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL,
 guests INTEGER NOT NULL CHECK(guests BETWEEN 1 AND 4), kind TEXT NOT NULL CHECK(kind IN ('inquiry','booking')),
 message TEXT, language TEXT NOT NULL DEFAULT 'de', status TEXT NOT NULL DEFAULT 'pending',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS requests_status ON requests(status,created_at);
