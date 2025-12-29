
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { processedArticles } from "../lib/db/schema";
import { desc, sql } from "drizzle-orm";

async function checkSources() {
    console.log("Checking source distribution...");
    const sources = await db
        .select({
            source_name: processedArticles.source_name,
            count: sql<number>`count(*)`
        })
        .from(processedArticles)
        .groupBy(processedArticles.source_name);

    console.log("Sources:", JSON.stringify(sources, null, 2));
}

checkSources();
