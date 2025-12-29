
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const envCheck = {
            hasKeywords: !!process.env.TURSO_DATABASE_URL,
            hasAuth: !!process.env.TURSO_AUTH_TOKEN,
            nodeEnv: process.env.NODE_ENV,
            dbUrlLength: process.env.TURSO_DATABASE_URL?.length,
            dbUrlStart: process.env.TURSO_DATABASE_URL?.substring(0, 20) + "...",
            dbUrlEnd: process.env.TURSO_DATABASE_URL?.slice(-10),
            authPrefix: process.env.TURSO_AUTH_TOKEN ? process.env.TURSO_AUTH_TOKEN.substring(0, 5) + "..." : "none"
        };

        let dbStatus = "unknown";
        let tableCheck = "unknown";
        let error = null;
        let existingTables: string[] = [];

        try {
            // Check if we can run a simple query
            await db.run(sql`SELECT 1`);
            dbStatus = "connected";

            // List all tables (SQLite specific)
            try {
                const tablesList = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table'`);
                existingTables = tablesList.rows.map((row: any) => row.name);
            } catch (e) {
                console.error("Failed to list tables", e);
            }

            // Check if blog_posts table exists by querying it
            const posts = await db.select().from(blogPosts).limit(1);
            tableCheck = `success (found ${posts.length} posts)`;
        } catch (e: any) {
            // Try to count daily_digests to verify connection to main DB
            let digestCount = "unknown";
            try {
                const res = await db.run(sql`SELECT count(*) as c FROM daily_digests`);
                digestCount = JSON.stringify(res.rows[0]);
            } catch (e2) {
                digestCount = "failed to count";
            }

            dbStatus = "failed (digest_count: " + digestCount + ")";
            error = {
                message: e.message,
                cause: e.cause ? JSON.stringify(e.cause, Object.getOwnPropertyNames(e.cause)) : "unknown",
                stack: e.stack
            };
        }

        // Setup Logic
        const { searchParams } = new URL(request.url);
        let setupResult = "skipped";

        if (searchParams.get("setup") === "true") {
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
                setupResult = "success: tables created";

                // Refresh existing tables
                const tablesList = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table'`);
                existingTables = tablesList.rows.map((row: any) => row.name);

                // Re-check table check
                const posts = await db.select().from(blogPosts).limit(1);
                tableCheck = `success (found ${posts.length} posts)`;
                dbStatus = "connected (setup ran)";
                error = null;

            } catch (e: any) {
                setupResult = "failed: " + e.message;
            }
        }

        return NextResponse.json({
            status: "Debug Info",
            env: envCheck,
            db: dbStatus,
            setup: setupResult,
            existingTables: existingTables,
            tables: tableCheck,
            error: error
        }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ fatal_error: e.message }, { status: 500 });
    }
}
