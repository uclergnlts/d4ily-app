import { config } from "dotenv";
import { randomUUID } from "crypto";
import { resolve } from "path";

// Load env vars BEFORE importing db
config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    // Dynamic imports to ensure env vars are ready
    const { db } = await import("@/lib/db");
    const { tweetsRaw } = await import("@/lib/db/schema");

    console.log("Testing DB insertion...");
    try {
        const dummyId = randomUUID();
        console.log(`Inserting dummy tweet with tweet_id: ${dummyId}`);

        await db.insert(tweetsRaw).values({
            tweet_id: dummyId,
            source: "test",
            published_at: new Date().toISOString(),
            raw_payload: { test: true },
        });

        console.log("Insert successful!");
    } catch (e: any) {
        console.error("Insert failed:", e);
    }
}

main();
