import { config } from "dotenv";
import { fetchRssFeed } from "@/lib/rss";
import { RSS_FEEDS } from "@/lib/config/sources";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    // Dynamic import
    const { db } = await import("@/lib/db");
    const { newsRaw } = await import("@/lib/db/schema");

    console.log("Testing News Fetching ONLY...");

    // Test just the first feed for speed
    const url = RSS_FEEDS[0];
    if (!url) {
        console.log("No RSS feeds configured.");
        return;
    }

    console.log(`Fetching RSS ${url}...`);
    try {
        const feed = await fetchRssFeed(url);
        console.log(`Got ${feed.items.length} items from ${feed.title}.`);

        let count = 0;
        for (const item of feed.items) {
            if (!item.link) continue;
            await db.insert(newsRaw).values({
                url: item.link,
                source_name: feed.title || "Unknown RSS",
                title: item.title,
                published_at: item.isoDate || item.pubDate,
                fetched_at: new Date().toISOString(),
                summary_raw: item.contentSnippet || item.content?.substring(0, 500),
                raw_payload: JSON.stringify(item),
                lang: "tr"
            }).onConflictDoUpdate({
                target: newsRaw.url,
                set: {
                    fetched_at: new Date().toISOString(),
                    title: item.title,
                }
            });
            count++;
        }
        console.log(`Upserted ${count} news items.`);
    } catch (e: any) {
        console.error(`Error processing RSS ${url}:`, e.message);
    }
    process.exit(0);
}

main();
