// Script to populate twitter_accounts and rss_sources tables
import { db } from "../lib/db";
import { twitterAccounts, rssSources } from "../lib/db/schema";
import { PERSONAL_ACCOUNTS, CORPORATE_ACCOUNTS, RSS_FEEDS } from "../lib/config/sources";

async function populateDatabase() {
    console.log("Starting database population...");

    // Populate Twitter accounts
    console.log(`\nInserting ${PERSONAL_ACCOUNTS.length} personal accounts...`);
    for (const username of PERSONAL_ACCOUNTS) {
        try {
            await db.insert(twitterAccounts).values({
                username,
                category: "kisisel",
                is_active: true,
                show_in_live_feed: true,  // Personal accounts show in live feed
                priority: 5,
                added_by: "system"
            }).onConflictDoNothing();
            console.log(`✓ ${username}`);
        } catch (e: any) {
            console.error(`✗ ${username}:`, e.message);
        }
    }

    console.log(`\nInserting ${CORPORATE_ACCOUNTS.length} corporate accounts...`);
    for (const username of CORPORATE_ACCOUNTS) {
        try {
            await db.insert(twitterAccounts).values({
                username,
                category: "kurumsal",
                is_active: true,
                show_in_live_feed: false,  // Corporate accounts hidden from live feed
                priority: 3,
                added_by: "system"
            }).onConflictDoNothing();
            console.log(`✓ ${username}`);
        } catch (e: any) {
            console.error(`✗ ${username}:`, e.message);
        }
    }

    // Populate RSS sources
    console.log(`\nInserting ${RSS_FEEDS.length} RSS feeds...`);
    for (const url of RSS_FEEDS) {
        try {
            // Extract name from URL
            const name = new URL(url).hostname.replace('www.', '');
            await db.insert(rssSources).values({
                url,
                name,
                category: "gundem",
                is_active: true,
                fetch_interval: 240,
                added_by: "system"
            }).onConflictDoNothing();
            console.log(`✓ ${name}`);
        } catch (e: any) {
            console.error(`✗ ${url}:`, e.message);
        }
    }

    console.log("\n✅ Database population complete!");

    // Show summary
    const totalTwitter = await db.select().from(twitterAccounts);
    const totalRSS = await db.select().from(rssSources);
    console.log(`\nTotal Twitter accounts: ${totalTwitter.length}`);
    console.log(`Total RSS sources: ${totalRSS.length}`);
}

populateDatabase().catch(console.error);
