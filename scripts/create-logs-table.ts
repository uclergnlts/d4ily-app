
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Creating blog_generation_logs table manually...");

    try {
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS blog_generation_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                run_date TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                selected_topic TEXT NOT NULL,
                cluster TEXT,
                evergreen_score INTEGER,
                result TEXT NOT NULL,
                reason TEXT,
                generated_post_id INTEGER
            );
        `);
        console.log("✅ Table created successfully.");
    } catch (e) {
        console.error("❌ Failed to create table:", e);
    }
}

main();
