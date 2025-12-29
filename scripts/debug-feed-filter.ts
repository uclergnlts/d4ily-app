
import { db } from '@/lib/db';
import { tweetsRaw } from '@/lib/db/schema';
import { PERSONAL_ACCOUNTS } from '@/lib/config/sources';
import { desc, sql } from 'drizzle-orm';

async function debugFilter() {
    console.log("🔍 Debugging Live Feed Filter...");
    console.log(`Checking DB for PERSONAL_ACCOUNTS (${PERSONAL_ACCOUNTS.length} accounts defined).`);

    // 1. Fetch raw tweets
    console.log("\n1. Fetching recent raw tweets from DB...");
    const rawData = await db.select()
        .from(tweetsRaw)
        .orderBy(desc(tweetsRaw.fetched_at))
        .limit(20);

    console.log(`Found ${rawData.length} tweets in DB.`);

    if (rawData.length === 0) return;

    // 2. Simulate Filter
    console.log("\n2. Checking Filter Logic:");
    const allowedUsernames = new Set(PERSONAL_ACCOUNTS.map(u => u.toLowerCase()));

    let passCount = 0;
    rawData.forEach(t => {
        const username = t.author_username || "unknown";
        const isAllowed = allowedUsernames.has(username.toLowerCase());
        const status = isAllowed ? "✅ PASS" : "❌ BLOCKED";

        console.log(`${status} | User: ${username.padEnd(20)} | Fetched: ${t.fetched_at}`);
        if (isAllowed) passCount++;
    });

    console.log(`\nResult: ${passCount} out of ${rawData.length} tweets passed the filter.`);

    // 3. Time Filter Check
    console.log("\n3. Checking Time Filter (24h):");
    const timeQuery = await db.run(sql`
        SELECT count(*) as count 
        FROM tweets_raw 
        WHERE fetched_at >= datetime('now', '-24 hours')
    `);
    // @ts-ignore
    console.log(`Tweets matching time query: ${timeQuery.rows[0].count}`);
}

debugFilter().catch(console.error);
