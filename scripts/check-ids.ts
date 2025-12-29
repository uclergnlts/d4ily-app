

import * as dotenv from "dotenv";
const env = dotenv.config({ path: ".env.local" });
console.log("Env loaded:", env.parsed ? "Yes" : "No");
console.log("DB URL:", process.env.TURSO_DATABASE_URL);

async function checkIds() {
    const { db } = await import("../lib/db");
    const { processedArticles } = await import("../lib/db/schema");
    const { desc } = await import("drizzle-orm");

    const articles = await db.select({ id: processedArticles.id, title: processedArticles.title }).from(processedArticles).orderBy(desc(processedArticles.processed_at)).limit(5);
    console.log("Current Valid IDs:", articles);
}

checkIds();
