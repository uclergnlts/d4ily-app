import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { processedArticles } from "../lib/db/schema";

async function clearTest() {
    console.log("Deleting TEST ARTICLE...");
    await db.delete(processedArticles).execute();
    console.log("Done! Checking:");
    const check = await db.select().from(processedArticles);
    console.log(`Remaining: ${check.length}`);
}

clearTest();
