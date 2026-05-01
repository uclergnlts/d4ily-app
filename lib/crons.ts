import { db } from "@/lib/db";
import { dailyDigests, newsRaw, processedArticles, rssSources, tweetsRaw, twitterAccounts, weeklyDigests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateDailyDigest, generateWeeklyDigest, generateWithGemini } from "@/lib/ai";
import { getCurrentWeekInfo, getDailyDigestsByDateRange } from "@/lib/digest-data";
import { TweetProcessor } from '@/lib/processor';
import { sql } from 'drizzle-orm';
import { getRSSSourcesDueForFetch, getTwitterAccountsDueForFetch } from "@/lib/sources";
import { fetchRssFeed } from "@/lib/rss";
import { fetchUserTweets, getTwitterFetchLimit, getTwitterFreshWindowHours } from "@/lib/twitter";
import { getMarketData } from "@/lib/services/market";

// --- Tweet Fetching Logic ---
export async function runFetchTweets(options: {
    force?: boolean;
    username?: string;
    limit?: number;
} = {}) {
    console.log("Starting scheduled tweet fetch...");
    const runStartedAt = Date.now();
    const runStartedIso = new Date(runStartedAt).toISOString();
    const maxRuntimeMs = Number.parseInt(process.env.TWITTER_FETCH_BUDGET_MS || "240000", 10);
    const runtimeBudgetMs = Number.isNaN(maxRuntimeMs) ? 240000 : Math.max(30000, maxRuntimeMs);
    const freshWindowHours = getTwitterFreshWindowHours();

    let totalFetched = 0;
    let totalInserted = 0;
    let stoppedEarly = false;
    const errors: string[] = [];
    const accountResults: Array<{
        username: string;
        fetched: number;
        inserted: number;
        latestPublishedAt: string | null;
        latestTweetId: string | null;
        reachedPreviousCursor: boolean | null;
        possibleCursorGap: boolean;
        error: string | null;
    }> = [];

    const accountLimit = Number.parseInt(process.env.TWITTER_ACCOUNTS_PER_RUN || "75", 10);
    const accountsToProcess = await getTwitterAccountsDueForFetch(
        options.limit ?? (Number.isNaN(accountLimit) ? 500 : Math.max(1, accountLimit)),
        {
            force: options.force,
            username: options.username,
        },
    );
    const usersToProcess = accountsToProcess.map((account) => account.username);
    const selectedByPriority = accountsToProcess.reduce<Record<string, number>>((acc, account) => {
        const key = String(account.priority);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const selectedByInterval = accountsToProcess.reduce<Record<string, number>>((acc, account) => {
        const key = `${account.fetchInterval}m`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    console.log(`Processing ${usersToProcess.length} Twitter accounts${options.force ? " (forced)" : " by priority/fetch interval"}`);

    const BATCH_SIZE = 5;
    let processedBatches = 0;
    for (let i = 0; i < usersToProcess.length; i += BATCH_SIZE) {
        if (Date.now() - runStartedAt > runtimeBudgetMs) {
            stoppedEarly = true;
            console.warn(`Stopping tweet fetch early after ${Date.now() - runStartedAt}ms runtime budget`);
            break;
        }

        const batch = accountsToProcess.slice(i, i + BATCH_SIZE);
        processedBatches += 1;

        await Promise.all(batch.map(async (account) => {
            const username = account.username;
            const accountResult = {
                username,
                fetched: 0,
                inserted: 0,
                latestPublishedAt: null as string | null,
                latestTweetId: null as string | null,
                reachedPreviousCursor: account.lastSeenTweetId ? false : null as boolean | null,
                possibleCursorGap: false,
                error: null as string | null,
            };

            try {
                console.log(`Fetching ${username}...`);
                const fetchStartedAt = new Date().toISOString();
                await db.update(twitterAccounts)
                    .set({
                        last_fetch_started_at: fetchStartedAt,
                        updated_at: fetchStartedAt,
                    })
                    .where(eq(twitterAccounts.username, username));

                const tweets = await fetchUserTweets(username);
                totalFetched += tweets.length;
                accountResult.fetched = tweets.length;
                const previousSeenTweetId = account.lastSeenTweetId;
                const fetchLimit = getTwitterFetchLimit();

                for (const tweet of tweets) {
                    const tweetId = tweet.id || tweet.conversationId;
                    if (!tweetId) continue;

                    if (previousSeenTweetId && tweetId === previousSeenTweetId) {
                        accountResult.reachedPreviousCursor = true;
                    }

                    const publishedAt = tweet.createdAt || new Date().toISOString();
                    const publishedMs = new Date(publishedAt).getTime();
                    const freshCutoffMs = Date.now() - freshWindowHours * 60 * 60 * 1000;
                    if (!Number.isFinite(publishedMs) || publishedMs < freshCutoffMs) {
                        continue;
                    }
                    if (!accountResult.latestPublishedAt || new Date(publishedAt).getTime() > new Date(accountResult.latestPublishedAt).getTime()) {
                        accountResult.latestPublishedAt = publishedAt;
                        accountResult.latestTweetId = tweetId;
                    }

                    try {
                        const inserted = await db.insert(tweetsRaw).values({
                            tweet_id: tweetId,
                            source: 'apify/x',
                            published_at: publishedAt,
                            lang: tweet.lang,
                            author_username: username,
                            retweet_count: tweet.retweetCount || 0,
                            reply_count: tweet.replyCount || 0,
                            like_count: tweet.likeCount || 0,
                            quote_count: tweet.quoteCount || 0,
                            view_count: tweet.viewCount || 0,
                            bookmark_count: tweet.bookmarkCount || 0,
                            raw_payload: tweet
                        }).onConflictDoNothing().returning({ id: tweetsRaw.id });

                        totalInserted += inserted.length;
                        accountResult.inserted += inserted.length;
                    } catch (dbError: any) {
                        console.error(`DB Error for tweet ${tweetId}:`, dbError.message);
                    }
                }

                accountResult.possibleCursorGap = Boolean(
                    previousSeenTweetId &&
                    accountResult.reachedPreviousCursor === false &&
                    tweets.length >= fetchLimit,
                );
                const completedAt = new Date().toISOString();
                await db.update(twitterAccounts)
                    .set({
                        last_fetched_at: completedAt,
                        last_fetch_completed_at: completedAt,
                        last_success_at: completedAt,
                        last_error_at: null,
                        last_error_message: null,
                        last_seen_tweet_id: accountResult.latestTweetId ?? account.lastSeenTweetId,
                        last_seen_tweet_published_at: accountResult.latestPublishedAt ?? account.lastSeenTweetPublishedAt,
                        consecutive_error_count: 0,
                        total_fetch_count: sql`${twitterAccounts.total_fetch_count} + 1`,
                        updated_at: completedAt,
                    })
                    .where(eq(twitterAccounts.username, username));
            } catch (error: any) {
                console.error(`Failed to fetch for ${username}:`, error.message);
                accountResult.error = error.message;
                errors.push(`${username}: ${error.message}`);
                const failedAt = new Date().toISOString();
                await db.update(twitterAccounts)
                    .set({
                        last_fetch_completed_at: failedAt,
                        last_error_at: failedAt,
                        last_error_message: error.message,
                        consecutive_error_count: sql`${twitterAccounts.consecutive_error_count} + 1`,
                        total_error_count: sql`${twitterAccounts.total_error_count} + 1`,
                        updated_at: failedAt,
                    })
                    .where(eq(twitterAccounts.username, username));
            } finally {
                accountResults.push(accountResult);
            }
        }));

        if (i + BATCH_SIZE < usersToProcess.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return {
        success: true,
        message: `Fetched ${totalFetched} tweets, inserted ${totalInserted} new ones.`,
        force: options.force ?? false,
        username: options.username ?? null,
        processed: usersToProcess.length,
        total_users: accountsToProcess.length,
        selection: {
            requested_limit: options.limit ?? (Number.isNaN(accountLimit) ? 75 : Math.max(1, accountLimit)),
            by_priority: selectedByPriority,
            by_interval: selectedByInterval,
        },
        accounts: accountResults.sort((left, right) => left.username.localeCompare(right.username)),
        accounts_with_tweets: accountResults.filter((account) => account.fetched > 0).length,
        accounts_with_new_tweets: accountResults.filter((account) => account.inserted > 0).length,
        accounts_with_errors: accountResults.filter((account) => account.error).length,
        accounts_with_possible_cursor_gap: accountResults.filter((account) => account.possibleCursorGap).length,
        fail_safe: {
            run_started_at: runStartedIso,
            run_completed_at: new Date().toISOString(),
            runtime_ms: Date.now() - runStartedAt,
            runtime_budget_ms: runtimeBudgetMs,
            stopped_early: stoppedEarly,
            processed_batches: processedBatches,
            batch_size: BATCH_SIZE,
            remaining_accounts: Math.max(0, usersToProcess.length - accountResults.length),
            can_continue_next_run: stoppedEarly || accountResults.length < usersToProcess.length,
        },
        freshness: {
            window_hours: freshWindowHours,
            oldest_allowed_at: new Date(Date.now() - freshWindowHours * 60 * 60 * 1000).toISOString(),
            rule: "Tweets older than the freshness window are ignored even if the provider returns them.",
        },
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
    };
}

// --- News Fetching Logic ---
export async function runFetchNews() {
    try {
        const results = [];

        const activeRSSFeeds = await getRSSSourcesDueForFetch();

        for (const source of activeRSSFeeds) {
            console.log(`Fetching RSS: ${source.url}...`);
            const feed = await fetchRssFeed(source.url);

            let newCount = 0;
            for (const item of feed.items) {
                if (!item.link) continue;

                // DEBUG log
                if (item.enclosure) console.log(`[DEBUG] Found enclosure for ${item.title}:`, item.enclosure);

                try {
                    const inserted = await db.insert(newsRaw).values({
                        url: item.link,
                        source_id: source.id > 0 ? String(source.id) : null,
                        source_name: source.name || feed.title || "Unknown RSS",
                        title: item.title,
                        published_at: item.isoDate || item.pubDate,
                        fetched_at: new Date().toISOString(),

                        summary_raw: item.contentSnippet || item.content?.substring(0, 500),
                        raw_payload: JSON.stringify({
                            ...item,
                            enclosure: item.enclosure,
                            'media:content': item['media:content'],
                            image: item.image,
                            itunes: item.itunes
                        }),
                        lang: "tr",
                    }).onConflictDoUpdate({
                        target: [newsRaw.url],
                        set: {
                            fetched_at: new Date().toISOString(),
                            title: item.title,
                            summary_raw: item.contentSnippet || item.content?.substring(0, 500),
                            raw_payload: JSON.stringify({
                                ...item,
                                enclosure: item.enclosure,
                                'media:content': item['media:content'],
                                image: item.image,
                                itunes: item.itunes
                            }),
                        }
                    }).returning({ id: newsRaw.id });
                    newCount += inserted.length;
                } catch (e: any) {
                    console.error(`Failed to insert news ${item.link}:`, e.message);
                }
            }
            if (source.id > 0) {
                await db.update(rssSources)
                    .set({ last_fetched_at: new Date().toISOString(), updated_at: new Date().toISOString() })
                    .where(eq(rssSources.id, source.id));
            }

            results.push({ url: source.url, fetched: feed.items.length, insertedOrUpdated: newCount, title: feed.title, priority: source.priority });
        }

        return { success: true, details: results };
    } catch (error: any) {
        throw new Error(error.message);
    }
}

// --- Digest Generation Logic ---
export async function runGenerateDigest() {
    const stepLogs: string[] = [];
    try {
        stepLogs.push("Step 1: Starting digest generation");
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        stepLogs.push(`Step 2: Date set to ${todayStr}`);

        stepLogs.push("Step 3: Fetching tweets...");
        const recentTweets = await db.select()
            .from(tweetsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`)
            .limit(200);
        stepLogs.push(`Step 3 complete: Found ${recentTweets.length} tweets`);

        // Use processedArticles instead of newsRaw to get AI summaries and images
        stepLogs.push("Step 4: Fetching processed articles...");
        const recentNews = await db.select()
            .from(processedArticles)
            .where(sql`processed_at >= datetime('now', '-1 day')`)
            .limit(100);
        stepLogs.push(`Step 4 complete: Found ${recentNews.length} news items`);

        if (recentTweets.length === 0 && recentNews.length === 0) {
            return { message: "No new data to digest.", skipped: true, logs: stepLogs };
        }

        console.log(`Generating digest for ${todayStr} with ${recentTweets.length} tweets and ${recentNews.length} processed news items (with images).`);

        stepLogs.push("Step 5: Processing tweets...");
        const processedTweets = TweetProcessor.process(recentTweets);
        console.log(`Smart Editor: Reduced ${recentTweets.length} -> ${processedTweets.length} tweets.`);
        stepLogs.push(`Step 5 complete: Reduced to ${processedTweets.length} tweets`);

        // Fetch market data for context
        let marketData = null;
        try {
            stepLogs.push("Step 6: Fetching market data...");
            marketData = await getMarketData();
            console.log("Market data fetched for digest generation.");
            stepLogs.push("Step 6 complete: Market data fetched");
        } catch (e: any) {
            console.error("Failed to fetch market data for digest:", e);
            stepLogs.push(`Step 6 warning: Market data failed - ${e.message}`);
        }

        stepLogs.push("Step 7: Generating digest with Gemini AI...");
        const digestData = await generateDailyDigest(todayStr, processedTweets, recentNews, marketData);
        stepLogs.push("Step 7 complete: Digest generated successfully");

        stepLogs.push("Step 8: Skipping cover image fetch in backend-only mode");
        const coverImageUrl: string | null = null;

        stepLogs.push("Step 9: Saving to database...");
        await db.insert(dailyDigests).values({
            digest_date: todayStr,
            title: digestData.title,
            intro: digestData.intro,
            content: digestData.content,
            content_audio: digestData.content_audio,
            trends: digestData.trends,
            watchlist: digestData.watchlist,
            tweets_count: recentTweets.length,
            news_count: recentNews.length,
            model_name: "gemini-2.0-flash",
            status: "generated",
            cover_image_url: coverImageUrl,
            date: todayStr,
        }).onConflictDoUpdate({
            target: [dailyDigests.digest_date],
            set: {
                title: digestData.title,
                intro: digestData.intro,
                content: digestData.content,
                content_audio: digestData.content_audio,
                trends: digestData.trends,
                watchlist: digestData.watchlist,
                tweets_count: recentTweets.length,
                news_count: recentNews.length,
                updated_at: new Date().toISOString(),
                model_name: "gemini-2.0-flash (updated)"
            }
        });
        stepLogs.push("Step 9 complete: Saved to database");

        return {
            success: true,
            digest: digestData,
            logs: stepLogs
        };

    } catch (error: any) {
        console.error("Digest generation failed at step:", stepLogs[stepLogs.length - 1]);
        console.error("Full error:", error);
        // Re-throw with context
        const enhancedError = new Error(`${error.message} | Last step: ${stepLogs[stepLogs.length - 1] || 'unknown'}`);
        (enhancedError as any).stepLogs = stepLogs;
        throw enhancedError;
    }
}

// --- Weekly Digest Generation Logic ---
export async function runGenerateWeeklyDigest() {
    try {
        const { weekId, year, weekNumber, startDate, endDate } = getCurrentWeekInfo();

        console.log(`Generating weekly digest for ${weekId} (${startDate} to ${endDate})`);

        // Get daily digests from this week
        const dailyDigests = await getDailyDigestsByDateRange(startDate, endDate);

        if (dailyDigests.length === 0) {
            return { message: "No daily digests available for this week.", skipped: true };
        }

        console.log(`Found ${dailyDigests.length} daily digests for the week.`);

        // Generate weekly digest using AI
        const weeklyData = await generateWeeklyDigest(weekId, startDate, endDate, dailyDigests);

        // Get total counts
        const tweetsCount = dailyDigests.reduce((sum: number, d: any) => sum + (d.tweets_count || 0), 0);
        const newsCount = dailyDigests.reduce((sum: number, d: any) => sum + (d.news_count || 0), 0);

        // Save to database
        await db.insert(weeklyDigests).values({
            week_id: weekId,
            year,
            week_number: weekNumber,
            start_date: startDate,
            end_date: endDate,
            title: weeklyData.title,
            intro: weeklyData.intro,
            content: weeklyData.content,
            highlights: weeklyData.highlights,
            trends: weeklyData.trends,
            digests_count: dailyDigests.length,
            tweets_count: tweetsCount,
            news_count: newsCount,
            model_name: "gemini-2.0-flash",
            status: "generated",
        }).onConflictDoUpdate({
            target: [weeklyDigests.week_id],
            set: {
                title: weeklyData.title,
                intro: weeklyData.intro,
                content: weeklyData.content,
                highlights: weeklyData.highlights,
                trends: weeklyData.trends,
                digests_count: dailyDigests.length,
                tweets_count: tweetsCount,
                news_count: newsCount,
                updated_at: new Date().toISOString(),
                model_name: "gemini-2.0-flash (updated)"
            }
        });

        return {
            success: true,
            weekId,
            weeklyDigest: weeklyData
        };

    } catch (error: any) {
        console.error("Weekly digest generation failed:", error);
        throw new Error(error.message);
    }
}

// --- Data Cleanup Logic ---
export async function runCleanupData() {
    try {
        console.log("Starting database cleanup...");

        // 1. Delete tweets older than 30 days
        const tweetsResult = await db.run(sql`
            DELETE FROM tweets_raw 
            WHERE fetched_at < datetime('now', '-30 days')
        `);

        // 2. Delete news older than 30 days
        const newsResult = await db.run(sql`
            DELETE FROM news_raw 
            WHERE fetched_at < datetime('now', '-30 days')
        `);

        // Note: We DO NOT delete daily_digests or weekly_digests as they are the archive

        console.log("Cleanup completed.");
        return {
            success: true,
            message: "Old data pruned successfully.",
            timestamp: new Date().toISOString()
        };
    } catch (error: any) {
        console.error("Cleanup failed:", error);
        throw new Error(error.message);
    }
}

// --- Official Gazette Fetching Logic ---
// Re-implementing the logic that was removed from on-demand service
import { officialGazetteSummaries } from "@/lib/db/schema";
import * as cheerio from 'cheerio';

export async function runFetchOfficialGazette() {
    console.log("Starting Official Gazette fetch...");
    const stepLogs: string[] = [];

    try {
        stepLogs.push("Step 1: Getting current date");
        const today = new Date().toISOString().split('T')[0];
        stepLogs.push(`Step 1 complete: Date is ${today}`);

        // Check if already exists
        stepLogs.push("Step 2: Checking if summary already exists");
        const existing = await db.select().from(officialGazetteSummaries).where(eq(officialGazetteSummaries.date, today)).get();
        if (existing) {
            console.log("Official Gazette summary already exists for today.");
            return { success: true, message: "Already exists", skipped: true, date: today };
        }
        stepLogs.push("Step 2 complete: No existing summary found");

        // Fetch with timeout - try multiple URLs
        stepLogs.push("Step 3: Fetching Resmi Gazete website");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

        // Add browser-like headers to avoid being blocked
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        };

        // Try multiple URLs in case one is blocked
        const urlsToTry = [
            'https://www.resmigazete.gov.tr/',
            'https://resmigazete.gov.tr/',
            `https://www.resmigazete.gov.tr/fihrist?tarih=${today.split('-').reverse().join('.')}`
        ];

        let response = null;
        let usedUrl = '';
        let lastError = '';

        for (const url of urlsToTry) {
            try {
                stepLogs.push(`Trying URL: ${url}`);
                response = await fetch(url, {
                    signal: controller.signal,
                    headers: headers,
                    redirect: 'follow'
                });
                if (response.ok) {
                    usedUrl = url;
                    stepLogs.push(`Success with URL: ${url}`);
                    break;
                } else {
                    lastError = `HTTP ${response.status} from ${url}`;
                    stepLogs.push(`Failed: ${lastError}`);
                    response = null;
                }
            } catch (fetchError: any) {
                lastError = `${fetchError.name}: ${fetchError.message} from ${url}`;
                stepLogs.push(`Error: ${lastError}`);
            }
        }

        clearTimeout(timeoutId);

        if (!response) {
            // Graceful failure - don't crash the cron, just report the issue
            console.warn("Could not fetch Resmi Gazete - site may be blocking cloud IPs");
            return {
                success: true,
                message: `Could not reach Resmi Gazete website. Last error: ${lastError}`,
                skipped: true,
                date: today,
                logs: stepLogs,
                note: "Site may be blocking cloud provider IPs. Manual intervention may be needed."
            };
        }
        stepLogs.push(`Step 3 complete: Website fetched successfully from ${usedUrl}`);

        stepLogs.push("Step 4: Parsing HTML content");
        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract content - structure is flattened but ordered in #html-content
        const contentDiv = $('#html-content');
        let mainText = "";

        if (contentDiv.length > 0) {
            contentDiv.children().each((_, el) => {
                const $el = $(el);
                const text = $el.text().trim();
                if (!text) return;

                if ($el.hasClass('html-title')) {
                    mainText += `\n\n### ${text}\n`;
                } else if ($el.hasClass('html-subtitle')) {
                    mainText += `\n#### ${text}\n`;
                } else if ($el.hasClass('fihrist-item')) {
                    mainText += `- ${text}\n`;
                }
            });
        } else {
            // Fallback for different structure
            console.log("Warning: #html-content not found, falling back to link search.");
            const items: string[] = [];
            $('a[href*="/eskiler/"]').each((_, el) => {
                const text = $(el).text().trim();
                if (text && text.length > 10) items.push(text);
            });
            mainText = items.join('\n');
        }
        stepLogs.push(`Step 4 complete: Extracted ${mainText.length} characters of content`);

        if (!mainText || mainText.length < 50) {
            // No gazette published today (weekend or holiday)
            return {
                success: true,
                message: "No gazette content available today (possibly weekend/holiday)",
                skipped: true,
                date: today
            };
        }

        // Generate Summary with AI
        stepLogs.push("Step 5: Generating AI summary");
        const prompt = `
        Aşağıda bugünkü T.C. Resmi Gazete'nin içerik metni yer almaktadır.
        Lütfen bu içeriği analiz et ve halkı/vatandaşı en çok ilgilendiren, en kritik 3 değişikliği veya kararı madde madde özetle.
        
        Özeti şu formatta ver (Markdown):
        - **[Konu Başlığı]**: [Kısa Açıklama]
        - **[Konu Başlığı]**: [Kısa Açıklama]
        - **[Konu Başlığı]**: [Kısa Açıklama]
        
        Sadece bu 3 maddeyi ver, başka bir şey ekleme.
        
        İÇERİK:
        ${mainText}
        `;

        let summary: string;
        try {
            summary = await generateWithGemini(prompt) || "Özet oluşturulamadı.";
        } catch (aiError: any) {
            throw new Error(`AI summary generation failed: ${aiError.message}`);
        }
        stepLogs.push("Step 5 complete: AI summary generated");

        stepLogs.push("Step 6: Saving to database");
        await db.insert(officialGazetteSummaries).values({
            date: today,
            summary_markdown: summary,
            gazette_url: usedUrl
        }).onConflictDoUpdate({
            target: officialGazetteSummaries.date,
            set: {
                summary_markdown: summary,
                gazette_url: usedUrl,
                created_at: sql`CURRENT_TIMESTAMP`
            }
        });
        stepLogs.push("Step 6 complete: Saved to database");

        console.log("Official Gazette summary generated and saved.");
        return { success: true, date: today, logs: stepLogs };

    } catch (error: any) {
        console.error("Official Gazette Cron Failed at step:", stepLogs[stepLogs.length - 1]);
        console.error("Full error:", error);
        const enhancedError = new Error(`${error.message} | Last step: ${stepLogs[stepLogs.length - 1] || 'unknown'}`);
        (enhancedError as any).stepLogs = stepLogs;
        throw enhancedError;
    }
}
