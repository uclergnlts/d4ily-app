import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { resolve } from "path";

// Load env vars first
config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    // Dynamic import to ensure env vars are populated
    const { db } = await import("@/lib/db");
    const { tweetsRaw, newsRaw } = await import("@/lib/db/schema");

    try {
        const tweetsCount = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(tweetsRaw);
        const newsCount = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(newsRaw);

        console.log(`Tweets Count: ${tweetsCount[0].count}`);
        console.log(`News Count: ${newsCount[0].count}`);
    } catch (e) {
        console.error(e);
    }
}

main();
