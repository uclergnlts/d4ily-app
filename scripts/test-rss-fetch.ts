
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { fetchRssFeed } from "../lib/rss";

// NTV or TRT often have images
const TEST_URL = "https://www.ntv.com.tr/gundem.rss";

async function test() {
    console.log(`Testing fetch on ${TEST_URL}...`);
    const feed = await fetchRssFeed(TEST_URL);

    if (feed.items.length === 0) {
        console.error("No items found.");
        return;
    }

    const item = feed.items[0];
    console.log("Title:", item.title);
    console.log("Custom Fields Check:");
    console.log("enclosure:", item.enclosure);
    console.log("media:content:", item['media:content']);
    console.log("image:", item.image);
    console.log("content:encoded length:", item['content:encoded']?.length);
}

test();
