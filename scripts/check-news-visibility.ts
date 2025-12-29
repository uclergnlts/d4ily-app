import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
console.log("DB URL (Env Check):", process.env.TURSO_DATABASE_URL || "Using fallback/local");

import { desc, eq, sql } from "drizzle-orm"; // These are stateless imports

async function check() {
    // Dynamic import to ensure DB connects with loaded Env Vars
    const { db } = await import("../lib/db");
    const { processedArticles } = await import("../lib/db/schema");

    console.log("Checking visibility conditions...");

    // 1. Raw count
    const allCount = await db.run(sql`SELECT COUNT(*) as count FROM processed_articles`);
    // @ts-ignore
    console.log(`Total Processed: ${allCount.rows[0].count}`);

    const rawCount = await db.run(sql`SELECT COUNT(*) as count FROM news_raw`);
    // @ts-ignore
    console.log(`Total News Raw: ${rawCount.rows[0].count}`);

    // 2. Published count (what the UI queries)
    const visibleQuery = await db
        .select()
        .from(processedArticles)
        .where(eq(processedArticles.is_published, true))
        .orderBy(desc(processedArticles.processed_at))
        .limit(5);

    console.log(`Visible (is_published=true): ${visibleQuery.length}`);

    if (visibleQuery.length > 0) {
        console.log("Sample Visible Item:", JSON.stringify(visibleQuery[0], null, 2));
    } else {
        // Check if there are any with is_published=false or 0
        const invisibleQuery = await db.select().from(processedArticles).limit(1);
        if (invisibleQuery.length > 0) {
            console.log("Sample INVISIBLE Item (is_published status):", invisibleQuery[0].is_published);
        }
    }
}

check();
