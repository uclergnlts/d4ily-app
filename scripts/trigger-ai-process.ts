

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function trigger() {
    console.log("Triggering manual AI processing...");
    // Dynamic import ensures env vars are loaded first
    const { processLatestNews } = await import("../lib/services/news-processor");

    try {
        await processLatestNews(5);
        console.log("Manual processing done.");
    } catch (e) {
        console.error("Manual processing failed:", e);
    }
}

trigger();
