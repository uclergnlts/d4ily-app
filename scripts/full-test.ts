import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function test() {
    const { processLatestNews } = await import("../lib/services/news-processor");
    const { db } = await import("../lib/db");
    const { processedArticles } = await import("../lib/db/schema");

    console.log("=== FULL TEST ===\n");

    // 1. Clear
    console.log("1. Clearing...");
    await db.delete(processedArticles).execute();

    // 2. Check empty
    const before = await db.select().from(processedArticles);
    console.log(`   Before: ${before.length} records\n`);

    // 3. Process
    console.log("2. Processing 3 articles...");
    await processLatestNews(3);

    // 4. Check immediately
    console.log("\n3. Checking immediately after processing...");
    const after = await db.select().from(processedArticles);
    console.log(`   After: ${after.length} records`);

    if (after.length > 0) {
        console.log("\n✅ SUCCESS! Articles saved:");
        after.forEach((a, i) => {
            console.log(`   ${i + 1}. ${a.title?.substring(0, 60)}...`);
            console.log(`      Image: ${a.image_url ? '✓' : '✗'}`);
        });
    } else {
        console.log("\n❌ PROBLEM: No records found!");
    }
}

test().catch(console.error);
