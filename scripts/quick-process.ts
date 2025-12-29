import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function triggerProcessing() {
    const { processLatestNews } = await import("../lib/services/news-processor");
    console.log("Triggering AI news processing (5 articles)...");
    try {
        await processLatestNews(5); // Just 5 for quick test
        console.log("Processing complete!");
    } catch (e) {
        console.error("Processing failed:", e);
    }
}

triggerProcessing();
