
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { sql } from "drizzle-orm"; // specific import is fine

async function deploy() {
    console.log("Deploying schema to production...");
    console.log("DB URL (Env):", process.env.TURSO_DATABASE_URL);

    // Dynamic import
    const { db } = await import("../lib/db");

    try {
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS processed_articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_news_id INTEGER REFERENCES news_raw(id),
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                category TEXT NOT NULL,
                image_url TEXT,
                source_name TEXT NOT NULL,
                published_at TEXT NOT NULL,
                is_published INTEGER NOT NULL DEFAULT 0,
                processed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✓ Table 'processed_articles' created.");

        await db.run(sql`CREATE INDEX IF NOT EXISTS processed_articles_processed_at_idx ON processed_articles(processed_at);`);
        console.log("✓ Index 'processed_articles_processed_at_idx' created.");

        await db.run(sql`CREATE INDEX IF NOT EXISTS processed_articles_original_id_idx ON processed_articles(original_news_id);`);
        console.log("✓ Index 'processed_articles_original_id_idx' created.");

    } catch (e) {
        console.error("❌ Deployment failed:", e);
    }
}

deploy().then(() => {
    console.log("Deployment script finished.");
}).catch((err) => {
    console.error("Top level error:", err);
});
