
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { newsRaw } from "../lib/db/schema";
import { desc } from "drizzle-orm";

async function inspectImages() {
    console.log("Inspecting latest news raw payloads...");

    // Get latest relative news
    const items = await db.select().from(newsRaw).orderBy(desc(newsRaw.fetched_at)).limit(20);
    // Filter for NTV or similar
    const ntvItems = items.filter(i => i.source_name?.includes('ntv') || i.url.includes('ntv'));

    (ntvItems.length > 0 ? ntvItems : items).forEach(item => {
        console.log(`\n--- ID: ${item.id} | Source: ${item.source_name} | Fetched: ${item.fetched_at} ---`);
        const payload = item.raw_payload as any;

        console.log("Enclosure (Typeof):", typeof payload.enclosure);
        console.log("Enclosure (Value):", JSON.stringify(payload.enclosure, null, 2));
        console.log("Media Content:", JSON.stringify(payload['media:content'], null, 2));
        console.log("Image:", JSON.stringify(payload.image, null, 2));
    });
}

inspectImages();
