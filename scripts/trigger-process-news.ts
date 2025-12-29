import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function triggerProcessing() {
    const { processLatestNews } = await import("../lib/services/news-processor");
    console.log("Triggering AI news processing...");
    try {
        await processLatestNews(20); // Process 20 articles
        console.log("Processing complete!");
    } catch (e) {
        console.error("Processing failed:", e);
    }
}

triggerProcessing();
