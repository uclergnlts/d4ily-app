import { config } from "dotenv";
import { resolve } from "path";

// Load env vars FIRST
config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    console.log("Starting manual digest generation...");

    // Dynamic imports to ensure env vars are available
    const { generateDailyDigest } = await import("@/lib/ai");
    const { db } = await import("@/lib/db");
    const { tweetsRaw, newsRaw, dailyDigests } = await import("@/lib/db/schema");
    const { sql } = await import("drizzle-orm");

    try {
        const todayStr = new Date().toISOString().split('T')[0];

        // Fetch Data
        console.log("Fetching recent data...");
        const tweets = await db.select()
            .from(tweetsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`)
            .limit(200);

        const news = await db.select()
            .from(newsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`)
            .limit(100);

        console.log(`Fetched ${tweets.length} tweets and ${news.length} news items.`);

        if (tweets.length === 0 && news.length === 0) {
            console.log("Not enough data to generate.");
            return;
        }

        console.log("Calling Gemini...");
        const result = await generateDailyDigest(todayStr, tweets, news);

        console.log("\n--- GENERATED DIGEST ---");
        console.log("TITLE:", result.title);
        console.log("INTRO:", result.intro);
        console.log("TRENDS:", result.trends);
        console.log("CONTENT LENGTH:", result.content.length);
        console.log("------------------------\n");

        // Save
        console.log("Saving to DB...");
        await db.insert(dailyDigests).values({
            digest_date: todayStr,
            title: result.title,
            intro: result.intro,
            content: result.content,
            trends: result.trends,
            watchlist: result.watchlist,
            tweets_count: tweets.length,
            news_count: news.length,
            model_name: "gemini-flash-latest (manual)",
            status: "generated",
            date: todayStr,
        }).onConflictDoUpdate({
            target: dailyDigests.digest_date,
            set: {
                title: result.title,
                intro: result.intro,
                content: result.content,
                trends: result.trends,
                watchlist: result.watchlist,
                tweets_count: tweets.length,
                news_count: news.length,
                updated_at: new Date().toISOString(),
                model_name: "gemini-flash-latest (manual)"
            }
        });
        console.log("Saved successfully.");

    } catch (e: any) {
        console.error("Error:", e);
    }
}

main();
