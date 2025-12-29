
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function checkImages() {
    const { db } = await import("../lib/db");
    const { processedArticles, newsRaw } = await import("../lib/db/schema");
    const { eq, desc, isNotNull, isNull } = await import("drizzle-orm");

    console.log("=== CHECKING PROCESSED ARTICLES IMAGE STATUS ===\n");

    // Total count
    const totalCount = await db.select().from(processedArticles);
    console.log(`Total processed articles: ${totalCount.length}`);

    // Count with images
    const withImages = await db.select().from(processedArticles).where(isNotNull(processedArticles.image_url));
    console.log(`Articles WITH images: ${withImages.length}`);

    // Count without images
    const withoutImages = await db.select().from(processedArticles).where(isNull(processedArticles.image_url));
    console.log(`Articles WITHOUT images: ${withoutImages.length}\n`);

    // Show latest 5 articles with details
    console.log("=== LATEST 5 PROCESSED ARTICLES ===\n");
    const latest = await db
        .select({
            id: processedArticles.id,
            title: processedArticles.title,
            image_url: processedArticles.image_url,
            source: processedArticles.source_name,
            processed_at: processedArticles.processed_at,
            original_id: processedArticles.original_news_id,
        })
        .from(processedArticles)
        .orderBy(desc(processedArticles.id))
        .limit(5);

    latest.forEach((article, idx) => {
        console.log(`${idx + 1}. [ID: ${article.id}] ${article.title}`);
        console.log(`   Source: ${article.source || 'N/A'}`);
        console.log(`   Image: ${article.image_url || '❌ NO IMAGE'}`);
        console.log(`   Processed: ${article.processed_at}`);
        console.log(`   Original News ID: ${article.original_id}\n`);
    });

    // Check a raw news item to see payload structure
    console.log("=== SAMPLE RAW NEWS PAYLOAD ===\n");
    const sampleRaw = await db
        .select()
        .from(newsRaw)
        .orderBy(desc(newsRaw.id))
        .limit(1);

    if (sampleRaw.length > 0) {
        const sample = sampleRaw[0];
        console.log(`Title: ${sample.title}`);
        console.log(`URL: ${sample.url}`);
        console.log(`Source: ${sample.source_name}`);
        console.log(`\nRaw Payload Keys:`, Object.keys(sample.raw_payload as any));
        console.log(`\nFull Payload:`, JSON.stringify(sample.raw_payload, null, 2));
    }
}

checkImages();
