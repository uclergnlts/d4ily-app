
import { db } from '@/lib/db';
import { tweetsRaw, newsRaw } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

async function checkData() {
    const tweets = await db.select({ count: sql<number>`count(*)` }).from(tweetsRaw);
    const news = await db.select({ count: sql<number>`count(*)` }).from(newsRaw);

    console.log("--- DATABASE STATUS ---");
    console.log(`Tweets Count: ${tweets[0].count}`);
    console.log(`News Count: ${news[0].count}`);

    // Check fetching times
    const recentTweets = await db.select().from(tweetsRaw).limit(5);
    console.log("\nRecent Tweets Sample:");
    recentTweets.forEach(t => {
        console.log(`- ID: ${t.tweet_id}, Source: ${t.source}, Fetched: ${t.fetched_at}`);
    });
}

checkData().catch(console.error);
