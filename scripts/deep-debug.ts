
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function debug() {
    const { db } = await import("../lib/db");
    const { processedArticles, newsRaw } = await import("../lib/db/schema");
    const { eq, desc } = await import("drizzle-orm");

    console.log("1. Listing all processed article IDs:");
    const all = await db.select({ id: processedArticles.id }).from(processedArticles).orderBy(desc(processedArticles.id)).limit(5);
    console.log("IDS:", all.map(a => a.id));

    if (all.length === 0) return;

    const testId = all[0].id; // Likely 116
    console.log(`TESTING ID: ${testId}`);

    const simple = await db.select().from(processedArticles).where(eq(processedArticles.id, testId)).get();
    console.log("SIMPLE GET:", simple ? "SUCCESS" : "FAIL");

    const joinRes = await db
        .select({ id: processedArticles.id })
        .from(processedArticles)
        .leftJoin(newsRaw, eq(processedArticles.original_news_id, newsRaw.id))
        .where(eq(processedArticles.id, testId))
        .get();

    console.log("JOIN GET:", joinRes ? "SUCCESS" : "FAIL");
}

debug();
