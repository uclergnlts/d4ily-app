
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function createProcessedArticlesTable() {
    console.log("Creating processed_articles table...");

    try {
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS processed_articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                original_news_id INTEGER REFERENCES news_raw(id),
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                category TEXT DEFAULT 'Gündem',
                image_url TEXT,
                source_name TEXT,
                published_at TEXT,
                processed_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                is_published INTEGER DEFAULT 1 NOT NULL
            )
        `);

        console.log("Creating indexes...");
        await db.run(sql`
            CREATE INDEX IF NOT EXISTS processed_articles_processed_at_idx ON processed_articles (processed_at)
        `);
        await db.run(sql`
            CREATE INDEX IF NOT EXISTS processed_articles_original_id_idx ON processed_articles (original_news_id)
        `);

        console.log("✅ processed_articles table created successfully!");
    } catch (error: any) {
        console.error("❌ Failed to create table:", error.message);
    }
}

createProcessedArticlesTable().catch(console.error);
