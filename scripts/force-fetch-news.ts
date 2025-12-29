
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
async function forceFetch() {
    // Dynamic import to ensure env is loaded first
    const { runFetchNews } = await import("../lib/crons");
    console.log("Forcing news fetch...");
    try {
        const result = await runFetchNews();
        console.log("Fetch success:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

forceFetch();
