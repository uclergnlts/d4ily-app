

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function repair() {
    console.log("Repairing indexes...");
    try {
        await db.run(sql`CREATE INDEX IF NOT EXISTS processed_articles_processed_at_idx ON processed_articles (processed_at)`);
        await db.run(sql`CREATE INDEX IF NOT EXISTS processed_articles_original_id_idx ON processed_articles (original_news_id)`);
        console.log("Indexes repaired.");
    } catch (e) {
        console.error("Repair failed:", e);
    }
}
repair().catch(console.error);
