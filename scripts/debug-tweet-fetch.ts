
import { config } from 'dotenv';
config({ path: '.env.local' });

import { runFetchTweets } from '@/lib/crons';
import { db } from '@/lib/db';
import { tweetsRaw } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

async function debugTweetFetch() {
    console.log("🔍 Starting Local Debugging for Tweet Fetch...");

    // 1. Check Environment Variables
    console.log("\n1. Environment Check:");
    console.log(`- TWITTER_API_KEY exists: ${!!process.env.TWITTER_API_KEY}`);
    if (process.env.TWITTER_API_KEY) {
        console.log(`- TWITTER_API_KEY length: ${process.env.TWITTER_API_KEY.length}`);
        console.log(`- TWITTER_API_KEY prefix: ${process.env.TWITTER_API_KEY.substring(0, 4)}...`);
    } else {
        console.error("❌ TWITTER_API_KEY is MISSING in .env.local!");
        console.log("Please add it to .env.local and try again.");
        return;
    }

    // 2. Run Fetch Logic
    console.log("\n2. Running runFetchTweets()...");
    try {
        const result = await runFetchTweets();

        console.log("\n3. Result:");
        console.log(JSON.stringify(result, null, 2));

        // 3. Check Database
        if (result.success) {
            const count = await db.select({ count: sql<number>`count(*)` }).from(tweetsRaw);
            console.log(`\n4. Database Verification:`);
            console.log(`- Total tweets in 'tweets_raw': ${count[0].count}`);
        }

    } catch (error: any) {
        console.error("\n❌ CRITICAL ERROR during execution:");
        console.error(error);
    }
}

debugTweetFetch().catch(console.error);
