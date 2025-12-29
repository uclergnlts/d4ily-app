import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function setupPushTable() {
    console.log("Creating push_subscriptions table...");

    try {
        await db.run(sql`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL UNIQUE,
        keys_p256dh TEXT,
        keys_auth TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

        // Create index for faster lookups
        await db.run(sql`
      CREATE INDEX IF NOT EXISTS idx_push_endpoint ON push_subscriptions(endpoint)
    `);

        console.log("✅ push_subscriptions table created successfully!");

        // Check table structure
        const result = await db.all(sql`PRAGMA table_info(push_subscriptions)`);
        console.log("Table structure:", result);

    } catch (error) {
        console.error("Error creating table:", error);
        throw error;
    }
}

setupPushTable()
    .then(() => {
        console.log("Done!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Failed:", err);
        process.exit(1);
    });
