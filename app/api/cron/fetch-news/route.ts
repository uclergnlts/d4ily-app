import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsRaw } from "@/lib/db/schema";
import { fetchRssFeed } from "@/lib/rss";
import { RSS_FEEDS } from "@/lib/config/sources";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const results = [];

        for (const url of RSS_FEEDS) {
            console.log(`Fetching RSS: ${url}...`);
            const feed = await fetchRssFeed(url);

            let newCount = 0;
            for (const item of feed.items) {
                if (!item.link) continue;

                try {
                    await db.insert(newsRaw).values({
                        url: item.link,
                        source_name: feed.title || "Unknown RSS",
                        title: item.title,
                        published_at: item.isoDate || item.pubDate, // isoDate is preferred
                        fetched_at: new Date().toISOString(),
                        summary_raw: item.contentSnippet || item.content?.substring(0, 500), // truncation
                        raw_payload: JSON.stringify(item),
                        lang: "tr", // Assuming TR sources based on config
                    }).onConflictDoUpdate({
                        target: newsRaw.url,
                        set: {
                            fetched_at: new Date().toISOString(),
                            // Update title/content if changed?
                            title: item.title,
                            summary_raw: item.contentSnippet || item.content?.substring(0, 500),
                            raw_payload: JSON.stringify(item),
                        }
                    });
                    newCount++;
                } catch (e: any) {
                    console.error(`Failed to insert news ${item.link}:`, e.message);
                }
            }
            results.push({ url, fetched: feed.items.length, title: feed.title });
        }

        return NextResponse.json({ success: true, details: results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
