
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function diagnose() {
    console.log("--- Starting Diagnosis ---");
    let cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
        console.warn("⚠️ CRON_SECRET missing in .env.local, using fallback/hardcoded for test.");
        cronSecret = "admin-secret-teccvclef9hk9lxyvbvu5";
    }

    // 1. Test AI News Feed Trigger
    console.log("\n1. Testing AI News Feed Trigger (via HTTP)...");
    try {
        const response = await fetch("http://localhost:3000/api/cron/process-news", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${cronSecret}`
            }
        });
        const text = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${text.substring(0, 500)}...`); // Print first 500 chars
    } catch (e) {
        console.error("❌ Failed to fetch process-news:", e);
    }

    // 2. Check Database for Processed Articles
    console.log("\n2. Checking Database...");
    try {
        const processedResult = await db.run(sql`SELECT COUNT(*) as count FROM processed_articles`);
        // @ts-ignore
        console.log(`Processed Articles Count: ${processedResult.rows[0].count}`);

        const rawResult = await db.run(sql`SELECT COUNT(*) as count FROM news_raw`);
        // @ts-ignore
        console.log(`Raw News Count: ${rawResult.rows[0].count}`);

        const rssResult = await db.run(sql`SELECT COUNT(*) as count FROM rss_sources`);
        // @ts-ignore
        console.log(`RSS Sources Count: ${rssResult.rows[0].count}`);

    } catch (e) {
        console.error("❌ Failed to query database:", e);
    }

    // 3. Test OG Image Endpoint
    console.log("\n3. Testing OG Image Endpoint...");
    try {
        const ogResponse = await fetch("http://localhost:3000/api/og/weekly?title=Test%20Digest&week=1", {
            method: "GET"
        });
        console.log(`Status: ${ogResponse.status}`);
        const contentType = ogResponse.headers.get("content-type");
        console.log(`Content-Type: ${contentType}`);
        if (!ogResponse.ok) {
            const errText = await ogResponse.text();
            console.log(`Error Body: ${errText}`);
        }
    } catch (e) {
        console.error("❌ Failed to fetch OG Image:", e);
    }
}

diagnose();
