import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { processedArticles } from "../lib/db/schema";
import { desc, isNotNull } from "drizzle-orm";

async function checkImages() {
    console.log("Checking news images in processed_articles...\n");

    const withImages = await db
        .select()
        .from(processedArticles)
        .where(isNotNull(processedArticles.image_url))
        .orderBy(desc(processedArticles.processed_at))
        .limit(10);

    const withoutImages = await db
        .select()
        .from(processedArticles)
        .orderBy(desc(processedArticles.processed_at))
        .limit(10);

    console.log(`Articles WITH images: ${withImages.length}`);
    console.log(`Total recent articles: ${withoutImages.length}\n`);

    if (withImages.length > 0) {
        console.log("Sample articles with images:");
        withImages.forEach(a => {
            console.log(`- ${a.title?.substring(0, 50)}...`);
            console.log(`  Image: ${a.image_url}\n`);
        });
    }

    console.log("\nRecent articles (checking image_url):");
    withoutImages.forEach(a => {
        console.log(`- ${a.title?.substring(0, 50)}...`);
        console.log(`  Has Image: ${a.image_url ? 'YES' : 'NO'}`);
        if (a.image_url) console.log(`  URL: ${a.image_url}`);
        console.log();
    });
}

checkImages();
