import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../lib/db";
import { processedArticles, newsRaw } from "../lib/db/schema";
import { sql } from "drizzle-orm";

async function testDatabase() {
    console.log("Testing database connection...\n");

    // 1. Check if table exists
    try {
        const tableCheck = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table' AND name='processed_articles'`);
        console.log("✓ processed_articles table exists");
    } catch (e) {
        console.log("✗ processed_articles table DOES NOT exist!");
        console.error(e);
        return;
    }

    // 2. Count existing records
    const count = await db.select({ count: sql<number>`count(*)` }).from(processedArticles);
    console.log(`Current record count: ${count[0].count}`);

    // 3. Try a test insert
    try {
        const testInsert = await db.insert(processedArticles).values({
            title: "TEST ARTICLE - Manual DB Check",
            summary: "This is a test to verify database writes work correctly.",
            category: "Test",
            source_name: "Manual Test",
            published_at: new Date().toISOString(),
            is_published: false
        }).returning();

        console.log("\n✅ TEST INSERT SUCCESSFUL!");
        console.log("Inserted ID:", testInsert[0]?.id);

        // Verify it's there
        const verify = await db.select().from(processedArticles).limit(5);
        console.log(`\nVerification: Now have ${verify.length} records`);

        // Delete test record
        if (testInsert[0]?.id) {
            await db.delete(processedArticles).where(sql`id = ${testInsert[0].id}`);
            console.log("Test record cleaned up");
        }

    } catch (e: any) {
        console.log("\n❌ TEST INSERT FAILED!");
        console.error(e.message);
    }

    // 4. Check newsRaw
    const rawNews = await db.select().from(newsRaw).limit(3);
    console.log(`\n📰 Raw news count (first 3): ${rawNews.length}`);
    if (rawNews.length > 0) {
        console.log(`Sample: ${rawNews[0].title}`);
    }
}

testDatabase().then(() => {
    console.log("\nDatabase test completed!");
    process.exit(0);
});
