import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function checkLatestDigest() {
    const { db } = await import("../lib/db");
    const { dailyDigests } = await import("../lib/db/schema");
    const { desc } = await import("drizzle-orm");

    console.log("📊 Checking Latest Digest...\n");

    const latest = await db.select()
        .from(dailyDigests)
        .orderBy(desc(dailyDigests.id))
        .limit(1);

    if (latest.length > 0) {
        const digest = latest[0];
        console.log("✅ Latest Digest Found:\n");
        console.log(`📅 Date: ${digest.digest_date}`);
        console.log(`📰 Title: ${digest.title}`);
        console.log(`📊 News Count: ${digest.news_count}`);
        console.log(`🐦 Tweets Count: ${digest.tweets_count}`);
        console.log(`🎨 Cover Image: ${digest.cover_image_url ? '✅ YES' : '❌ NO'}`);
        console.log(`📝 Content Length: ${digest.content?.length || 0} chars`);
        console.log(`\n--- INTRO ---`);
        console.log(digest.intro);
        console.log(`\n--- CONTENT PREVIEW (first 500 chars) ---`);
        console.log(digest.content?.substring(0, 500) + "...");
        console.log(`\n--- TRENDS ---`);
        console.log(JSON.stringify(digest.trends, null, 2));
    } else {
        console.log("❌ No digests found in database.");
    }
}

checkLatestDigest();
