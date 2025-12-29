import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { processedArticles } from "../lib/db/schema";

async function simpleCheck() {
    console.log("Simple DB check...");
    const all = await db.select().from(processedArticles).limit(5);
    console.log(`Total: ${all.length}`);
    all.forEach(a => {
        console.log(`- ${a.title}`);
        console.log(`  Image: ${a.image_url || 'NONE'}\n`);
    });
}

simpleCheck();
