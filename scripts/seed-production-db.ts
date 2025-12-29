// Production DB Seed Script - Uses production Turso credentials
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { twitterAccounts, rssSources } from "../lib/db/schema";
import { PERSONAL_ACCOUNTS, CORPORATE_ACCOUNTS, RSS_FEEDS } from "../lib/config/sources";

async function seedProductionDB() {
    console.log("🚀 Starting production database seed...");

    // Get production credentials from .env.local
    const dbUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!dbUrl || !authToken) {
        throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN in .env.local");
    }

    console.log(`📡 Connecting to production DB: ${dbUrl.substring(0, 30)}...`);

    const client = createClient({
        url: dbUrl,
        authToken: authToken,
    });

    const db = drizzle(client);

    let twitterCount = 0;
    let rssCount = 0;

    // Populate Twitter accounts - Personal
    console.log(`\n📝 Inserting ${PERSONAL_ACCOUNTS.length} personal accounts...`);
    for (const username of PERSONAL_ACCOUNTS) {
        try {
            await db.insert(twitterAccounts).values({
                username,
                category: "kisisel",
                is_active: true,
                show_in_live_feed: true,
                priority: 5,
                added_by: "system"
            }).onConflictDoNothing();
            twitterCount++;
            process.stdout.write(`✓ ${username} `);
        } catch (e: any) {
            console.error(`\n✗ ${username}:`, e.message);
        }
    }

    // Populate Twitter accounts - Corporate
    console.log(`\n\n📝 Inserting ${CORPORATE_ACCOUNTS.length} corporate accounts...`);
    for (const username of CORPORATE_ACCOUNTS) {
        try {
            await db.insert(twitterAccounts).values({
                username,
                category: "kurumsal",
                is_active: true,
                show_in_live_feed: false,
                priority: 3,
                added_by: "system"
            }).onConflictDoNothing();
            twitterCount++;
            process.stdout.write(`✓ ${username} `);
        } catch (e: any) {
            console.error(`\n✗ ${username}:`, e.message);
        }
    }

    // Populate RSS sources
    console.log(`\n\n📝 Inserting ${RSS_FEEDS.length} RSS feeds...`);
    for (const url of RSS_FEEDS) {
        try {
            const name = new URL(url).hostname.replace('www.', '');
            await db.insert(rssSources).values({
                url,
                name,
                category: "gundem",
                is_active: true,
                fetch_interval: 240,
                added_by: "system"
            }).onConflictDoNothing();
            rssCount++;
            process.stdout.write(`✓ ${name} `);
        } catch (e: any) {
            console.error(`\n✗ ${url}:`, e.message);
        }
    }

    console.log("\n\n✅ Production database seed complete!");
    console.log(`📊 Summary:`);
    console.log(`   - Twitter accounts: ${twitterCount}`);
    console.log(`   - RSS sources: ${rssCount}`);
}

seedProductionDB().catch(console.error);
