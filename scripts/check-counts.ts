
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { newsRaw, processedArticles } from "../lib/db/schema";
import { count } from "drizzle-orm";

async function checkCounts() {
    const rawCount = await db.select({ value: count() }).from(newsRaw);
    const procCount = await db.select({ value: count() }).from(processedArticles);
    console.log("News Raw Count:", rawCount[0].value);
    console.log("Processed Count:", procCount[0].value);
}

checkCounts();
