import { config } from "dotenv";
import { createClient } from "@libsql/client";
import { resolve } from "path";
import fs from "fs";
import path from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    console.log("⚠️  RESETTING DATABASE ⚠️");

    // 1. Drop existing tables
    const tables = [
        "tweets_raw",
        "news_raw",
        "daily_digests",
        "daily_events",
        "audio_assets",
        "digest_reactions"
    ];

    for (const table of tables) {
        try {
            console.log(`Dropping table ${table}...`);
            await client.execute(`DROP TABLE IF EXISTS ${table}`);
        } catch (e: any) {
            console.error(`Error dropping ${table}:`, e.message);
        }
    }

    // 2. Apply migration
    console.log("Applying migration...");
    const migrationPath = path.resolve(process.cwd(), "migrations/0000_little_nebula.sql");
    const migrationSql = fs.readFileSync(migrationPath, "utf-8");

    // Split by statement separator (Drizzle uses --> statement-breakpoint)
    const statements = migrationSql.split("--> statement-breakpoint");

    for (const statement of statements) {
        if (!statement.trim()) continue;
        try {
            await client.execute(statement);
            console.log("Executed statement.");
        } catch (e: any) {
            console.error("Error executing statement:", e.message);
            console.error("Statement:", statement.substring(0, 100) + "...");
        }
    }

    console.log("Database reset complete.");
}

main();
