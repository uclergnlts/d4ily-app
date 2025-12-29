
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { newsRaw } from "../lib/db/schema";
import { desc } from "drizzle-orm";

async function getUrl() {
    console.log("Fetching latest news URL...");
    const result = await db.select({ url: newsRaw.url, title: newsRaw.title })
        .from(newsRaw)
        .orderBy(desc(newsRaw.fetched_at))
        .limit(1);

    if (result[0]) console.log("URL:", result[0].url);
    else console.log("No URL found");
}

getUrl();
