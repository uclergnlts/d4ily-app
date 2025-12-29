
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function check() {
    const { db } = await import("../lib/db");
    const { processedArticles, newsRaw } = await import("../lib/db/schema");
    const { eq, desc } = await import("drizzle-orm");

    console.log("DB URL:", process.env.TURSO_DATABASE_URL);
    console.log(`Listing first 5 articles...`);

    const results = await db
        .select({
            id: processedArticles.id,
            title: processedArticles.title,
            original_url: newsRaw.url,
        })
        .from(processedArticles)
        .leftJoin(newsRaw, eq(processedArticles.original_news_id, newsRaw.id))
        .orderBy(desc(processedArticles.id))
        .limit(5);

    console.log("Results:", JSON.stringify(results, null, 2));
}

check();
