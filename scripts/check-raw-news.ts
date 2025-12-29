import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { newsRaw } from "../lib/db/schema";
import { desc } from "drizzle-orm";

async function checkNewsRaw() {
    console.log("Checking news_raw table...");
    const news = await db.select().from(newsRaw).orderBy(desc(newsRaw.fetched_at)).limit(5);
    console.log(`Total fetched: ${news.length}\n`);
    news.forEach(n => {
        console.log(`- ${n.title}`);
        console.log(`  Source: ${n.source_name}`);
        console.log(`  Fetched: ${n.fetched_at}\n`);
    });
}

checkNewsRaw();
