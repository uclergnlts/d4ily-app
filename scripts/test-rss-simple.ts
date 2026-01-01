import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { fetchRssFeed } from "../lib/rss";

const RSS_TEST_FEEDS = [
    "https://www.birgun.net/rss/kategori/siyaset-8",
    "http://rss.dw-world.de/rdf/rss-tur-all",
    "https://www.aa.com.tr/tr/rss/default?cat=guncel",
    "https://tr.sputniknews.com/export/rss2/archive/index.xml",
    "http://feeds.bbci.co.uk/turkce/rss.xml",
    "https://www.ntv.com.tr/gundem.rss"
];

async function testRSSFeeds() {
    const results: any[] = [];

    for (const url of RSS_TEST_FEEDS) {
        try {
            const feed = await fetchRssFeed(url);
            results.push({
                url,
                status: feed.items?.length > 0 ? 'WORKING' : 'EMPTY',
                title: feed.title || 'Unknown',
                itemCount: feed.items?.length || 0,
                latestItem: feed.items?.[0]?.title || 'N/A'
            });
        } catch (error: any) {
            results.push({
                url,
                status: 'FAILED',
                error: error.message
            });
        }
    }

    console.log(JSON.stringify(results, null, 2));
}

testRSSFeeds();
