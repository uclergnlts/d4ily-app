import { config } from "dotenv";
import { resolve } from "path";

// 1. Load Env
config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    // 2. Dynamic Import
    const { db } = await import("@/lib/db");
    const { tweetsRaw } = await import("@/lib/db/schema");
    const { getTopTweetsByDate } = await import("@/lib/digest-data");
    const { desc } = await import("drizzle-orm");

    const todayStr = new Date().toISOString().split('T')[0];
    console.log(`Checking tweets for date: ${todayStr}`);

    // 1. Check raw tweets in DB - USING 'fetched_at' for ordering
    const recentTweets = await db.select({
        id: tweetsRaw.id,
        published_at: tweetsRaw.published_at,
        fetched_at: tweetsRaw.fetched_at,
        like_count: tweetsRaw.like_count
    })
        .from(tweetsRaw)
        .orderBy(desc(tweetsRaw.fetched_at))
        .limit(5);

    console.log("\n--- Latest 5 Raw Tweets in DB ---");
    recentTweets.forEach(t => console.log(JSON.stringify(t, null, 2)));

    // 2. Check getTopTweetsByDate
    console.log(`\nCalling getTopTweetsByDate('${todayStr}')...`);
    const topTweets = await getTopTweetsByDate(todayStr, 20);
    console.log(`Returned ${topTweets.length} tweets.`);

    if (topTweets.length > 0) {
        console.log("Sample tweet:", topTweets[0].content.substring(0, 50) + "...");
    } else {
        console.log("WARNING: No tweets returned!");
    }
}

main();
