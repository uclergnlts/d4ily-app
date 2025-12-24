import { db } from "@/lib/db";
import { dailyDigests, newsRaw, tweetsRaw, weeklyDigests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { fetchTweetsFromApify } from "@/lib/twitter";
import { fetchNewsFromRSS } from "@/lib/news";
import { generateDailyDigest, generateWeeklyDigest } from "@/lib/ai";
import { getCurrentWeekInfo, getDailyDigestsByDateRange } from "@/lib/digest-data";
import { searchUnsplashImage } from "@/lib/image-search";
import { TweetProcessor } from '@/lib/processor';
import { sql } from 'drizzle-orm';

// --- Tweet Fetching Logic ---
export async function runFetchTweets() {
    console.log("Starting scheduled tweet fetch...");

    let totalFetched = 0;
    let totalInserted = 0;
    const errors: string[] = [];

    // OPTIMIZATION: Process a random subset of users per run to ensure coverage over time
    const shuffled = [...TWITTER_USERS].sort(() => 0.5 - Math.random());
    const usersToProcess = shuffled.slice(0, 20);

    console.log(`Processing ${usersToProcess.length} users (random selection) out of ${TWITTER_USERS.length} total`);

    const BATCH_SIZE = 5;
    for (let i = 0; i < usersToProcess.length; i += BATCH_SIZE) {
        const batch = usersToProcess.slice(i, i + BATCH_SIZE);

        await Promise.all(batch.map(async (username) => {
            try {
                console.log(`Fetching ${username}...`);
                const tweets = await fetchUserTweets(username);
                totalFetched += tweets.length;

                for (const tweet of tweets) {
                    const tweetId = tweet.id || tweet.conversationId;
                    if (!tweetId) continue;

                    try {
                        await db.insert(tweetsRaw).values({
                            tweet_id: tweetId,
                            source: 'apify/x',
                            published_at: tweet.createdAt || new Date().toISOString(),
                            lang: tweet.lang,
                            author_username: username,
                            retweet_count: tweet.retweetCount || 0,
                            reply_count: tweet.replyCount || 0,
                            like_count: tweet.likeCount || 0,
                            quote_count: tweet.quoteCount || 0,
                            view_count: tweet.viewCount || 0,
                            bookmark_count: tweet.bookmarkCount || 0,
                            raw_payload: tweet
                        }).onConflictDoNothing();

                        totalInserted++;
                    } catch (dbError: any) {
                        console.error(`DB Error for tweet ${tweetId}:`, dbError.message);
                    }
                }
            } catch (error: any) {
                console.error(`Failed to fetch for ${username}:`, error.message);
                errors.push(`${username}: ${error.message}`);
            }
        }));

        if (i + BATCH_SIZE < usersToProcess.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return {
        success: true,
        message: `Fetched ${totalFetched} tweets, inserted ${totalInserted} new ones.`,
        processed: usersToProcess.length,
        total_users: TWITTER_USERS.length,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
    };
}

// --- News Fetching Logic ---
export async function runFetchNews() {
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
                        published_at: item.isoDate || item.pubDate,
                        fetched_at: new Date().toISOString(),
                        summary_raw: item.contentSnippet || item.content?.substring(0, 500),
                        raw_payload: JSON.stringify(item),
                        lang: "tr",
                    }).onConflictDoUpdate({
                        target: [newsRaw.url],
                        set: {
                            fetched_at: new Date().toISOString(),
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

        return { success: true, details: results };
    } catch (error: any) {
        throw new Error(error.message);
    }
}

// --- Digest Generation Logic ---
export async function runGenerateDigest() {
    try {
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const recentTweets = await db.select()
            .from(tweetsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`)
            .limit(200);

        const recentNews = await db.select()
            .from(newsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`)
            .limit(100);

        if (recentTweets.length === 0 && recentNews.length === 0) {
            return { message: "No new data to digest.", skipped: true };
        }

        console.log(`Generating digest for ${todayStr} with ${recentTweets.length} tweets and ${recentNews.length} news items.`);

        const processedTweets = TweetProcessor.process(recentTweets);
        console.log(`Smart Editor: Reduced ${recentTweets.length} -> ${processedTweets.length} tweets.`);

        const digestData = await generateDailyDigest(todayStr, processedTweets, recentNews);

        const coverImageUrl = await fetchGoogleImage(digestData.title);

        await db.insert(dailyDigests).values({
            digest_date: todayStr,
            title: digestData.title,
            intro: digestData.intro,
            content: digestData.content,
            trends: digestData.trends,
            watchlist: digestData.watchlist,
            tweets_count: recentTweets.length,
            news_count: recentNews.length,
            model_name: "gemini-flash-latest",
            status: "generated",
            cover_image_url: coverImageUrl,
            date: todayStr,
        }).onConflictDoUpdate({
            target: [dailyDigests.digest_date],
            set: {
                title: digestData.title,
                intro: digestData.intro,
                content: digestData.content,
                trends: digestData.trends,
                watchlist: digestData.watchlist,
                tweets_count: recentTweets.length,
                news_count: recentNews.length,
                updated_at: new Date().toISOString(),
                model_name: "gemini-1.5-pro (updated)"
            }
        });

        return {
            success: true,
            digest: digestData
        };

    } catch (error: any) {
        throw new Error(error.message);
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
            model_name: "gemini-flash-latest",
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
                model_name: "gemini-flash-latest (updated)"
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
