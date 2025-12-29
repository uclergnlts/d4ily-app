import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

async function main() {
  console.log("Setting up blog tables...")
  const url = process.env.TURSO_DATABASE_URL;
  const auth = process.env.TURSO_AUTH_TOKEN;
  console.log("Using DB URL:", url ? (url.substring(0, 10) + "..." + url.slice(-10)) : "undefined");
  console.log("Using Auth:", auth ? (auth.substring(0, 5) + "...") : "undefined");

  try {
    // 1. Topics Table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        parent_id INTEGER REFERENCES topics(id),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `)
    console.log("✅ Created 'topics' table")

    // 2. Blog Posts Table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        cover_image_url TEXT,
        published INTEGER DEFAULT 0 NOT NULL,
        seo_score INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        topic_id INTEGER REFERENCES topics(id),
        tags TEXT,
        meta_title TEXT,
        meta_description TEXT,
        published_at TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `)
    console.log("✅ Created 'blog_posts' table")

    // 3. Keywords Table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS keywords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        term TEXT NOT NULL UNIQUE,
        volume INTEGER DEFAULT 0,
        difficulty INTEGER DEFAULT 0,
        target_post_id INTEGER REFERENCES blog_posts(id),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `)
    console.log("✅ Created 'keywords' table")

    // 4. Internal Links Table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS internal_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_post_id INTEGER REFERENCES blog_posts(id),
        target_post_id INTEGER REFERENCES blog_posts(id),
        anchor_text TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `)
    console.log("✅ Created 'internal_links' table")

    console.log("All blog tables set up successfully!")

    // List tables to verify
    const tablesList = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table'`);
    const tableNames = tablesList.rows.map((row: any) => row.name);
    console.log("Existing tables in DB:", tableNames);

    // Count digests
    try {
      const digestCount = await db.run(sql`SELECT count(*) as c FROM daily_digests`);
      console.log("Daily Digests Count:", digestCount.rows[0]);
    } catch (e) {
      console.log("Could not count digests");
    }

    // Count posts
    const postCount = await db.run(sql`SELECT count(*) as c FROM blog_posts`);
    console.log("Blog Posts Count:", postCount.rows[0]);

  } catch (error) {
    console.error("Error setting up tables:", error)
  }
}

main()
