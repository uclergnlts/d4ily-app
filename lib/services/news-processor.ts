
import { db } from "../db";
import { newsRaw, processedArticles } from "../db/schema";
import { summarizeArticle, checkDuplicateArticle } from "../ai";
import { desc, notInArray, sql } from "drizzle-orm";

type ProcessedNewsResult = {
    title: string;
    summary: string;
    category: string;
};

type ProcessNewsStats = {
    success: true;
    candidates: number;
    processed: number;
    skipped: number;
    failed: number;
    sourceCount: number;
};

const FALLBACK_STOPWORDS = new Set([
    "ama", "ancak", "bile", "bir", "çok", "daha", "de", "da", "diye", "gibi",
    "için", "ile", "olan", "olarak", "son", "ve", "veya", "yeni", "sonra",
]);

function cleanText(value: string | null | undefined) {
    return (value || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeForCompare(value: string) {
    return cleanText(value)
        .toLocaleLowerCase("tr-TR")
        .normalize("NFKD")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokensForCompare(value: string) {
    return normalizeForCompare(value)
        .split(" ")
        .filter((token) => token.length >= 4 && !FALLBACK_STOPWORDS.has(token));
}

function titleCaseFallback(title: string) {
    return cleanText(title)
        .replace(/^\s*(son dakika|flash|flaş)\s*[:|-]\s*/i, "")
        .replace(/\s*\|\s*.*$/, "")
        .replace(/\s+-\s+son dakika.*$/i, "")
        .trim();
}

function buildFallbackSummary(title: string, rawContent: string) {
    const cleaned = cleanText(rawContent);
    if (!cleaned) {
        return title;
    }

    const sentences = cleaned
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 20);

    const summary = sentences.slice(0, 2).join(" ");
    return (summary || cleaned).slice(0, 420).trim();
}

function inferCategory(title: string, rawContent: string, source: string) {
    const text = normalizeForCompare(`${title} ${rawContent} ${source}`);

    if (/\b(dolar|euro|borsa|enflasyon|faiz|merkez bankasi|tcmb|ekonomi|petrol|altin|altın)\b/.test(text)) {
        return "Ekonomi";
    }

    if (/\b(futbol|basketbol|spor|galatasaray|fenerbahce|fenerbahçe|besiktas|beşiktaş|trabzonspor)\b/.test(text)) {
        return "Spor";
    }

    if (/\b(teknoloji|yapay zeka|ai|apple|google|microsoft|siber|uzay)\b/.test(text)) {
        return "Teknoloji";
    }

    if (/\b(saglik|sağlık|hastane|doktor|bakanligi|bakanlığı|virus|virüs|asi|aşı)\b/.test(text)) {
        return "Sağlık";
    }

    if (/\b(abd|avrupa|rusya|ukrayna|israil|gazze|iran|suriye|almanya|fransa|ingiltere|dunya|dünya)\b/.test(text)) {
        return "Dünya";
    }

    return "Gündem";
}

function shouldSkipFallback(title: string, rawContent: string) {
    const text = normalizeForCompare(`${title} ${rawContent}`);
    const weakPatterns = [
        "burc",
        "burç",
        "iddaa",
        "bahis",
        "kampanya",
        "indirim",
        "sponsorlu",
        "reklam",
    ];

    return weakPatterns.some((pattern) => text.includes(pattern));
}

function processArticleFallback(title: string, rawContent: string, source: string): ProcessedNewsResult {
    const fallbackTitle = titleCaseFallback(title) || "Haber sinyali";

    if (shouldSkipFallback(fallbackTitle, rawContent)) {
        return { title: "SKIP", summary: "", category: "Gündem" };
    }

    return {
        title: fallbackTitle.slice(0, 140),
        summary: buildFallbackSummary(fallbackTitle, rawContent),
        category: inferCategory(fallbackTitle, rawContent, source),
    };
}

function isDuplicateFallback(title: string, existingTitles: string[]) {
    const newTokens = new Set(tokensForCompare(title));
    if (newTokens.size === 0) {
        return false;
    }

    return existingTitles.some((existingTitle) => {
        const existingTokens = new Set(tokensForCompare(existingTitle));
        if (existingTokens.size === 0) {
            return false;
        }

        let matches = 0;
        for (const token of newTokens) {
            if (existingTokens.has(token)) matches += 1;
        }

        return matches / Math.min(newTokens.size, existingTokens.size) >= 0.72;
    });
}

function sourceKey(value: string | null) {
    return (value || "Unknown Source").toLocaleLowerCase("tr-TR").trim();
}

function getSourceBalancedCandidates<T extends { source_name: string | null }>(rows: T[], limit: number) {
    const buckets = new Map<string, T[]>();

    for (const row of rows) {
        const key = sourceKey(row.source_name);
        const bucket = buckets.get(key) || [];
        bucket.push(row);
        buckets.set(key, bucket);
    }

    const selected: T[] = [];
    while (selected.length < limit) {
        let addedInRound = false;
        for (const bucket of buckets.values()) {
            const next = bucket.shift();
            if (!next) continue;

            selected.push(next);
            addedInRound = true;

            if (selected.length >= limit) break;
        }

        if (!addedInRound) break;
    }

    return selected;
}

export async function processLatestNews(limit = 10) {
    console.log("Starting news processing...");
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const stats: ProcessNewsStats = {
        success: true,
        candidates: 0,
        processed: 0,
        skipped: 0,
        failed: 0,
        sourceCount: 0,
    };

    // 1. Find news that hasn't been processed yet
    // We get the IDs of already processed articles
    const processedIds = await db
        .select({ id: processedArticles.original_news_id })
        .from(processedArticles)
        .where(sql`${processedArticles.original_news_id} IS NOT NULL`);

    const existingIds = processedIds.map(p => p.id).filter(id => id !== null) as number[];

    const candidatePoolLimit = Math.max(limit * 8, 50);
    const candidatePool = existingIds.length > 0
        ? await db.select().from(newsRaw).where(notInArray(newsRaw.id, existingIds)).orderBy(desc(newsRaw.fetched_at)).limit(candidatePoolLimit)
        : await db.select().from(newsRaw).orderBy(desc(newsRaw.fetched_at)).limit(candidatePoolLimit);
    const candidates = getSourceBalancedCandidates(candidatePool, limit);
    stats.candidates = candidates.length;
    stats.sourceCount = new Set(candidates.map((candidate) => sourceKey(candidate.source_name))).size;

    if (candidates.length === 0) {
        console.log("No new news to process.");
        return stats;
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

            let result: ProcessedNewsResult;
            if (hasGemini) {
                try {
                    result = await summarizeArticle(processedTitle, textToProcess, sourceName);
                } catch (error) {
                    console.warn(`AI processing failed, using fallback for news ID ${news.id}:`, error);
                    result = processArticleFallback(processedTitle, textToProcess, sourceName);
                }
            } else {
                result = processArticleFallback(processedTitle, textToProcess, sourceName);
            }

            // CHECK: Skip if AI filtered it out as spam/clickbait/advertisement
            if (result.title === "SKIP" || result.title.includes("SKIP")) {
                console.log(`⊘ Skipped (filtered by AI): ${news.title}`);
                stats.skipped++;
                continue; // Move to next article
            }

            // CHECK: Skip if duplicate or very similar to recent articles
            const isDuplicate = hasGemini
                ? await checkDuplicateArticle(result.title, result.summary, recentTitles)
                : isDuplicateFallback(result.title, recentTitles);

            if (isDuplicate) {
                console.log(`⊘ Skipped (duplicate detected): ${result.title}`);
                stats.skipped++;
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

            recentTitles.push(result.title);
            stats.processed++;
            console.log(`✓ Processed: ${result.title} ${imageUrl ? '(With Image)' : '(No Image)'}`);
        } catch (error) {
            stats.failed++;
            console.error(`❌ Failed to process news ID ${news.id}:`, error);
        }
    }

    console.log("News processing completed.", stats);
    return stats;
}
