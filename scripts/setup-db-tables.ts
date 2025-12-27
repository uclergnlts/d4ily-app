import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function setupDatabase() {
    console.log("Setting up database tables...");

    try {
        // Create twitter_accounts table
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS twitter_accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                username TEXT NOT NULL,
                display_name TEXT,
                category TEXT DEFAULT 'genel',
                priority INTEGER DEFAULT 0 NOT NULL,
                is_active INTEGER DEFAULT 1 NOT NULL,
                show_in_live_feed INTEGER DEFAULT 0 NOT NULL,
                notes TEXT,
                added_by TEXT DEFAULT 'admin',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
        `);

        await db.run(sql`
            CREATE UNIQUE INDEX IF NOT EXISTS twitter_accounts_username_unique 
            ON twitter_accounts (username)
        `);

        console.log("✓ twitter_accounts table created");

        // Create rss_sources table
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS rss_sources (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                url TEXT NOT NULL,
                name TEXT NOT NULL,
                category TEXT DEFAULT 'gundem',
                is_active INTEGER DEFAULT 1 NOT NULL,
                fetch_interval INTEGER DEFAULT 240,
                last_fetched_at TEXT,
                notes TEXT,
                added_by TEXT DEFAULT 'admin',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
        `);

        await db.run(sql`
            CREATE UNIQUE INDEX IF NOT EXISTS rss_sources_url_unique 
            ON rss_sources (url)
        `);

        console.log("✓ rss_sources table created");
        console.log("\n✅ Database setup completed successfully!");

    } catch (error: any) {
        console.error("❌ Database setup failed:", error.message);
        throw error;
    }
}

setupDatabase().catch(console.error);
