import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testDuplicate() {
    const { processLatestNews } = await import("../lib/services/news-processor");
    console.log("Testing AI duplicate detection...\n");

    try {
        // Process 5 articles to test duplicate checking
        await processLatestNews(5);
        console.log("\n✅ Duplicate detection test completed!");
    } catch (e: any) {
        console.error("❌ Test failed:", e.message);
    }
}

testDuplicate();
