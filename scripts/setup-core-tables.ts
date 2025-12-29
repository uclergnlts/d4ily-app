
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function setupCoreTables() {
    console.log("🛠️ Setting up CORE database tables...");

    try {
        // --- 1. tweets_raw ---
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS tweets_raw (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                tweet_id TEXT NOT NULL,
                source TEXT DEFAULT 'apify/x' NOT NULL,
                published_at TEXT,
                fetched_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                lang TEXT,
                author_username TEXT,
                retweet_count INTEGER,
                reply_count INTEGER,
                like_count INTEGER,
                quote_count INTEGER,
                view_count INTEGER,
                bookmark_count INTEGER,
                raw_payload TEXT NOT NULL
            )
        `);
        await db.run(sql`
            CREATE UNIQUE INDEX IF NOT EXISTS tweets_raw_tweet_id_unique ON tweets_raw (tweet_id)
        `);
        console.log("✓ tweets_raw created");

        // --- 2. news_raw ---
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS news_raw (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                source_id TEXT,
                source_name TEXT,
                title TEXT,
                url TEXT NOT NULL,
                published_at TEXT,
                fetched_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                lang TEXT,
                summary_raw TEXT,
                raw_payload TEXT NOT NULL
            )
        `);
        await db.run(sql`
            CREATE UNIQUE INDEX IF NOT EXISTS news_raw_url_unique ON news_raw (url)
        `);
        console.log("✓ news_raw created");

        // --- 3. daily_digests ---
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS daily_digests (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                digest_date TEXT NOT NULL,
                title TEXT,
                intro TEXT,
                content TEXT NOT NULL,
                trends TEXT,
                watchlist TEXT,
                tweets_count INTEGER,
                news_count INTEGER,
                model_name TEXT,
                prompt_version TEXT,
                status TEXT DEFAULT 'generated' NOT NULL,
                error_message TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                published_at TEXT,
                audio_url TEXT,
                audio_duration_seconds INTEGER,
                audio_status TEXT DEFAULT 'pending',
                audio_voice TEXT,
                date TEXT DEFAULT CURRENT_DATE NOT NULL,
                word_count INTEGER DEFAULT 0 NOT NULL,
                published INTEGER DEFAULT 0 NOT NULL,
                cover_image_url TEXT,
                greeting_text TEXT,
                spotify_url TEXT,
                category TEXT DEFAULT 'gundem'
            )
        `);
        await db.run(sql`
            CREATE UNIQUE INDEX IF NOT EXISTS daily_digests_digest_date_unique ON daily_digests (digest_date)
        `);
        console.log("✓ daily_digests created");

        // --- 4. weekly_digests ---
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS weekly_digests (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                week_id TEXT NOT NULL,
                year INTEGER NOT NULL,
                week_number INTEGER NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                title TEXT NOT NULL,
                intro TEXT,
                content TEXT NOT NULL,
                highlights TEXT,
                trends TEXT,
                digests_count INTEGER DEFAULT 0,
                tweets_count INTEGER DEFAULT 0,
                news_count INTEGER DEFAULT 0,
                model_name TEXT,
                status TEXT DEFAULT 'generated' NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                cover_image_url TEXT
            )
        `);
        await db.run(sql`
            CREATE UNIQUE INDEX IF NOT EXISTS weekly_digests_week_id_unique ON weekly_digests (week_id)
        `);
        console.log("✓ weekly_digests created");

        console.log("\n✅ All core tables setup completed!");

    } catch (error: any) {
        console.error("❌ Database setup failed:", error.message);
        throw error;
    }
}

setupCoreTables().catch(console.error);
