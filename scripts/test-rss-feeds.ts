import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { fetchRssFeed } from "../lib/rss";
import { RSS_FEEDS } from "../lib/config/sources";

async function testRSSFeeds() {
    console.log("Testing RSS Feeds...\n");

    for (const url of RSS_FEEDS) {
        try {
            console.log(`\n🔍 Testing: ${url}`);
            const feed = await fetchRssFeed(url);

            if (feed.items && feed.items.length > 0) {
                console.log(`✅ SUCCESS - ${feed.title || 'Unknown'}`);
                console.log(`   📰 Items: ${feed.items.length}`);
                console.log(`   📅 Latest: ${feed.items[0]?.title?.substring(0, 60)}...`);
            } else {
                console.log(`⚠️  EMPTY - No items returned`);
            }
        } catch (error: any) {
            console.log(`❌ FAILED - ${error.message}`);
        }
    }
}

testRSSFeeds().then(() => {
    console.log("\n\nTest completed!");
    process.exit(0);
}).catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
