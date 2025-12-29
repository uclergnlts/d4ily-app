

import * as dotenv from "dotenv";
const envResult = dotenv.config({ path: ".env.local" });
console.log("Dotenv loaded:", envResult.parsed ? "Yes" : "No");

// Hardcode if missing for debugging (since we know it's in the file but maybe not loading)
if (!process.env.GEMINI_API_KEY) {
    console.warn("Manually setting GEMINI_API_KEY for testing...");
    process.env.GEMINI_API_KEY = "AIzaSyDZTJ-3_7l1PuLO0kVwxoH8iom9";
}

console.log("GEMINI_API_KEY in process.env:", process.env.GEMINI_API_KEY ? "***Present***" : "Missing");
console.log("TURSO_DATABASE_URL:", process.env.TURSO_DATABASE_URL || "Using fallback/local");

async function run() {
    console.log("Starting manual processing...");
    // Dynamic import so it sees the Env Var
    const { processLatestNews } = await import("../lib/services/news-processor");

    try {
        await processLatestNews(5);
        console.log("Processing finished.");
    } catch (e) {
        console.error("Processing crashed:", e);
    }
}

run();

