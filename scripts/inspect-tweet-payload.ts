import { config } from "dotenv";
import { resolve } from "path";

// 1. Load Env
config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    // 2. Dynamic Import
    const { db } = await import("@/lib/db");
    const { tweetsRaw } = await import("@/lib/db/schema");
    const { desc } = await import("drizzle-orm");

    console.log("Fetching latest tweet payload...");

    const recentTweets = await db.select({
        id: tweetsRaw.id,
        raw_payload: tweetsRaw.raw_payload
    })
        .from(tweetsRaw)
        .orderBy(desc(tweetsRaw.fetched_at))
        .limit(3);

    const fs = await import("fs");
    const payload = recentTweets[0].raw_payload;
    console.log("Type of payload:", typeof payload);
    fs.writeFileSync("debug_payload.json", JSON.stringify(payload, null, 2));
    console.log("Wrote payload to debug_payload.json");
}

main();
