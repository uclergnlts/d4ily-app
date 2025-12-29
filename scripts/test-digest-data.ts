
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testDigestGeneration() {
    console.log("=== TESTING DIGEST GENERATION WITH PROCESSED ARTICLES ===\n");

    const { db } = await import("../lib/db");
    const { processedArticles } = await import("../lib/db/schema");
    const { sql } = await import("drizzle-orm");

    // Check how many processed articles we have from the last day
    const recentProcessed = await db.select()
        .from(processedArticles)
        .where(sql`processed_at >= datetime('now', '-1 day')`)
        .limit(100);

    console.log(`📊 Found ${recentProcessed.length} processed articles from last 24 hours\n`);

    if (recentProcessed.length > 0) {
        console.log("Sample processed article structure:");
        const sample = recentProcessed[0];
        console.log({
            id: sample.id,
            title: sample.title,
            summary: sample.summary?.substring(0, 100) + "...",
            category: sample.category,
            image_url: sample.image_url ? "✅ HAS IMAGE" : "❌ NO IMAGE",
            source: sample.source_name,
            processed_at: sample.processed_at
        });
        console.log("\n");
    }

    // If we don't have recent articles, show total count
    if (recentProcessed.length === 0) {
        const allProcessed = await db.select().from(processedArticles);
        console.log(`⚠️  No articles from last 24h, but we have ${allProcessed.length} total processed articles.\n`);
        console.log("NOTE: For testing, you may want to run: npx tsx scripts/quick-process.ts\n");
        return;
    }

    console.log("✅ Ready to test digest generation!");
    console.log("\nTo test full digest generation run:");
    console.log("  npx tsx -e \"import('./lib/crons').then(m => m.runGenerateDigest())\"");
}

testDigestGeneration();
