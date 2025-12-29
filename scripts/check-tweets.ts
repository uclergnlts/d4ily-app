
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { tweetsRaw } from "../lib/db/schema";
import { desc, sql } from "drizzle-orm";

async function checkTweets() {
    console.log("Checking tweets...");
    try {
        const tweets = await db
            .select({ username: tweetsRaw.author_username })
            .from(tweetsRaw)
            .where(sql`${tweetsRaw.fetched_at} >= datetime('now', '-72 hours')`)
            .limit(200);

        console.log(`Total recent tweets: ${tweets.length}`);

        const counts: Record<string, number> = {};
        tweets.forEach(t => {
            const u = t.username || "unknown";
            counts[u] = (counts[u] || 0) + 1;
        });

        console.log("Usernames found:", counts);
    } catch (error) {
        console.error("Error:", error);
    }
}

checkTweets();
