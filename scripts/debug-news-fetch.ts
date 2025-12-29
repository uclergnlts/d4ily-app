
import { config } from 'dotenv';
config({ path: '.env.local' });

import { runFetchNews } from '@/lib/crons';
import { db } from '@/lib/db';
import { newsRaw } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

async function debugNewsFetch() {
    console.log("🔍 Starting Local Debugging for News Fetch...");

    // 1. Run Fetch Logic
    console.log("\n1. Running runFetchNews()...");
    try {
        const result = await runFetchNews();

        console.log("\n2. Result:");
        console.log(JSON.stringify(result, null, 2));

        // 2. Check Database
        if (result.success) {
            const count = await db.select({ count: sql<number>`count(*)` }).from(newsRaw);
            console.log(`\n3. Database Verification:`);
            console.log(`- Total news in 'news_raw': ${count[0].count}`);
        }

    } catch (error: any) {
        console.error("\n❌ CRITICAL ERROR during execution:");
        console.error(error);
    }
}

debugNewsFetch().catch(console.error);
