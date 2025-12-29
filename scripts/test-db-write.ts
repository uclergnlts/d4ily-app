import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { processedArticles } from "../lib/db/schema";

async function testWrite() {
    console.log("Testing direct write to processed_articles...");
    console.log("DB URL:", process.env.TURSO_DATABASE_URL);

    try {
        await db.insert(processedArticles).values({
            original_news_id: null,
            title: "TEST ARTICLE",
            summary: "Test summary",
            category: "Test",
            image_url: "https://example.com/test.jpg",
            source_name: "Test Source",
            published_at: new Date().toISOString(),
            is_published: true
        });

        console.log("✓ Write successful!");

        const check = await db.select().from(processedArticles).limit(1);
        console.log("Verification:", check);
    } catch (error) {
        console.error("❌ Write failed:", error);
    }
}

testWrite();
