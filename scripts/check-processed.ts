import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../lib/db";
import { processedArticles } from "../lib/db/schema";
import { desc } from "drizzle-orm";

async function checkProcessed() {
    const articles = await db.select()
        .from(processedArticles)
        .orderBy(desc(processedArticles.processed_at))
        .limit(10);

    console.log(`Total processed articles: ${articles.length}`);
    articles.forEach((a, i) => {
        console.log(`\n${i + 1}. ${a.title}`);
        console.log(`   Source: ${a.source_name}`);
        console.log(`   Image: ${a.image_url ? 'YES' : 'NO'}`);
        console.log(`   Published: ${a.is_published ? 'YES' : 'NO'}`);
    });
}

checkProcessed();
