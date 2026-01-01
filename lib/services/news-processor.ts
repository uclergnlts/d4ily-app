
import { db } from "../db";
import { newsRaw, processedArticles } from "../db/schema";
import { summarizeArticle, checkDuplicateArticle } from "../ai";
import { desc, notInArray, eq, sql } from "drizzle-orm";

export async function processLatestNews(limit = 10) {
    console.log("Starting news processing...");

    // 1. Find news that hasn't been processed yet
    // We get the IDs of already processed articles
    const processedIds = await db
        .select({ id: processedArticles.original_news_id })
        .from(processedArticles)
        .where(sql`${processedArticles.original_news_id} IS NOT NULL`);

    const existingIds = processedIds.map(p => p.id).filter(id => id !== null) as number[];

    // Fetch candidate news
    let query = db.select().from(newsRaw).orderBy(desc(newsRaw.fetched_at)).limit(limit);

    if (existingIds.length > 0) {
        // @ts-ignore - 'notInArray' typings can be tricky with complex queries, but this is valid
        query = db.select().from(newsRaw).where(notInArray(newsRaw.id, existingIds)).orderBy(desc(newsRaw.fetched_at)).limit(limit);
    }

    const candidates = await query;

    if (candidates.length === 0) {
        console.log("No new news to process.");
        return;
    }

    console.log(`Found ${candidates.length} news items to process.`);

    // Get recent article titles for duplicate checking (last 24 hours)
    const recentArticles = await db.select({ title: processedArticles.title })
        .from(processedArticles)
        .where(sql`processed_at >= datetime('now', '-1 day')`)
        .orderBy(desc(processedArticles.processed_at))
        .limit(100);

    const recentTitles = recentArticles.map(a => a.title);
    console.log(`Checking against ${recentTitles.length} recent articles for duplicates.`);

    for (const news of candidates) {
        try {
            console.log(`Processing: ${news.title}`);
            const textToProcess = news.summary_raw || news.title || "No Content";
            const sourceName = news.source_name || "Unknown Source";
            const processedTitle = news.title || "Untitled News";

            const result = await summarizeArticle(processedTitle, textToProcess, sourceName);

            // CHECK: Skip if AI filtered it out as spam/clickbait/advertisement
            if (result.title === "SKIP" || result.title.includes("SKIP")) {
                console.log(`⊘ Skipped (filtered by AI): ${news.title}`);
                continue; // Move to next article
            }

            // CHECK: Skip if duplicate or very similar to recent articles
            const isDuplicate = await checkDuplicateArticle(
                result.title,
                result.summary,
                recentTitles
            );

            if (isDuplicate) {
                console.log(`⊘ Skipped (duplicate detected): ${result.title}`);
                continue; // Move to next article
            }

            // Extract image from raw payload safely
            const payload = news.raw_payload as any;

            let imageUrl: string | null = null;

            // 1. Try explicit RSS fields
            if (payload.image_url) imageUrl = payload.image_url;
            else if (payload.enclosure?.url && payload.enclosure?.type?.startsWith('image')) imageUrl = payload.enclosure.url;
            else if (payload['media:content']?.['$']?.url) imageUrl = payload['media:content']['$'].url;
            else if (Array.isArray(payload['media:content']) && payload['media:content'][0]?.['$']?.url) imageUrl = payload['media:content'][0]['$'].url;
            else if (payload.itunes?.image) imageUrl = payload.itunes.image;

            // 2. Try parsing HTML content if no image found
            if (!imageUrl) {
                const htmlContent = news.summary_raw || payload['content:encoded'] || payload.content || "";

                // Try Regex for img src
                const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
                if (imgMatch && imgMatch[1]) {
                    imageUrl = imgMatch[1];
                }
            }

            // 3. Last Resort: Scrape the original URL for OpenGraph Image
            if (!imageUrl && news.url) {
                try {
                    console.log(`Attempting to scrape OG image from: ${news.url}`);
                    // Dynamic import cheerio
                    const cheerioModule = await import("cheerio");
                    // @ts-ignore
                    const cheerio = cheerioModule.default || cheerioModule;

                    const response = await fetch(news.url, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
                        signal: AbortSignal.timeout(5000) // 5s timeout
                    });

                    if (response.ok) {
                        const html = await response.text();
                        const $ = cheerio.load(html);
                        const ogImage = $('meta[property="og:image"]').attr('content');
                        if (ogImage) {
                            imageUrl = ogImage;
                            console.log(`✓ Found OG Image: ${ogImage}`);
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to scrape OG image for ${news.url}:`, err);
                }
            }

            // Cleanup URL (some simple cleaning if needed, e.g. removal of query params if they are dynamic resizers?)
            // For now, keep as is.

            await db.insert(processedArticles).values({
                original_news_id: news.id,
                title: result.title,
                summary: result.summary,
                category: result.category,
                image_url: imageUrl,
                source_name: sourceName,
                published_at: news.published_at || new Date().toISOString(),
                is_published: true
            });

            // IMMEDIATE VERIFICATION
            const verification = await db.select().from(processedArticles).limit(1);
            console.log(`  [DEBUG] Immediate check: ${verification.length} records in DB`);

            console.log(`✓ Processed: ${result.title} ${imageUrl ? '(With Image)' : '(No Image)'}`);
        } catch (error) {
            console.error(`❌ Failed to process news ID ${news.id}:`, error);
        }
    }

    console.log("News processing completed.");
}
