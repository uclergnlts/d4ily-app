
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { processedArticles } from "../lib/db/schema";
import { sql } from "drizzle-orm";

async function clearArticles() {
    console.log("Clearing processed articles...");
    await db.run(sql`DELETE FROM ${processedArticles}`);
    console.log("Cleared.");
}

clearArticles();
