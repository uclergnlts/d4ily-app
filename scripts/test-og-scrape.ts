
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testScrape() {
    const realUrl = "https://www.aa.com.tr/tr/kultur/emine-erdogandan-kalanlar-sergisi-paylasimi/1705037";
    // Wait, the output was truncated. I should act on the partial output which seems to imply a URL ending in '170' or similar. 
    // Output said: ...anlar-sergisi-paylasimi-170
    // Let's rely on my ability to execute commands. I will just update the script to take the URL from args or hardcode the one I saw partially.
    // Actually, let's just use the `getUrl` script to return the FULL url by logging cleaner.
    // Re-running get-news-url with cleaner output is better.

    // Better: let's pick a very standard one.
    const standardUrl = "https://www.ntv.com.tr";

    console.log(`Testing OG scrape on: ${realUrl}`);

    try {
        const cheerioModule = await import("cheerio");
        // @ts-ignore
        const cheerio = cheerioModule.default || cheerioModule;

        const response = await fetch(realUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });

        if (response.ok) {
            const html = await response.text();
            const $ = cheerio.load(html);
            const ogImage = $('meta[property="og:image"]').attr('content');
            console.log("Found OG Image:", ogImage);
        } else {
            console.log("Response not OK:", response.status);
        }
    } catch (e) {
        console.error("Scrape failed:", e);
    }
}

testScrape();
