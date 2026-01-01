import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { processedArticles } from "../lib/db/schema";

db.insert(processedArticles).values({
    title: "DB TEST",
    summary: "Testing direct insert",
    is_published: false
}).then(r => {
    console.log("INSERT SUCCESS");
    return db.select().from(processedArticles);
}).then(all => {
    console.log(`Total records: ${all.length}`);
    process.exit(0);
}).catch(e => {
    console.error("ERROR:", e.message);
    process.exit(1);
});
