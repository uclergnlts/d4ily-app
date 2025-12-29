
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function checkEnv() {
    console.log("🔍 Checking Environment Variables...");
    const required = [
        "TURSO_DATABASE_URL",
        "TURSO_AUTH_TOKEN",
        "GEMINI_API_KEY",
        "CRON_SECRET",
        "NEXT_PUBLIC_APP_URL"
    ];

    let missing = 0;
    for (const key of required) {
        if (!process.env[key]) {
            console.error(`❌ Missing: ${key}`);
            missing++;
        } else {
            console.log(`✅ Found: ${key}`);
        }
    }

    if (missing > 0) {
        console.error(`⚠️ ${missing} critical environment variables missing!`);
    } else {
        console.log("✅ All critical env vars present.");
    }
}

async function checkDatabase() {
    console.log("\n🔍 Checking Database Connection & Tables...");

    try {
        // Check simply by running a query
        const result = await db.run(sql`SELECT 1`);
        console.log("✅ Database Connection Successful");
    } catch (e: any) {
        console.error("❌ Database Connection Failed:", e.message);
        return;
    }

    const tables = [
        "daily_digests",
        "blog_posts",
        "blog_generation_logs",
        "twitter_accounts",
        "rss_sources",
        "weekly_digests"
    ];

    for (const table of tables) {
        try {
            // Check if table exists by selecting 1 limit 0 usually, 
            // but with libSql/sqlite usually we query sqlite_master
            const tableCheck = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table' AND name=${table}`);

            // Drizzle verify might need a select
            if (tableCheck.rows.length > 0) {
                console.log(`✅ Table exists: ${table}`);
            } else {
                console.error(`❌ Table MISSING: ${table}`);
            }
        } catch (e: any) {
            console.error(`❌ Error checking table ${table}:`, e.message);
        }
    }
}

async function main() {
    console.log("🚀 Starting D4ily System Health Check...\n");
    await checkEnv();
    await checkDatabase();
    console.log("\n🏁 Health Check Complete.");
}

main();
