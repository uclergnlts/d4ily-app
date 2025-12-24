import { config } from "dotenv";
import { fetchUserTweets } from "@/lib/twitter";
import { fetchRssFeed } from "@/lib/rss";
import { TWITTER_USERS, RSS_FEEDS } from "@/lib/config/sources";

config({ path: ".env.local" });

async function main() {
    // Dynamic import to ensure env vars are loaded first
    const { db } = await import("@/lib/db");
    const { tweetsRaw, newsRaw } = await import("@/lib/db/schema");

    console.log("Starting manual data fetch...");

    // 1. Tweets
    console.log("\n--- Fetching Tweets ---");
    // 1. Tweets
    console.log("\n--- Fetching Tweets ---");

    // Batch processing (same as Cron)
    const BATCH_SIZE = 20;
    const RATE_LIMIT_DELAY = 60 * 1000; // 60s
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const chunks = [];
    for (let i = 0; i < TWITTER_USERS.length; i += BATCH_SIZE) {
        chunks.push(TWITTER_USERS.slice(i, i + BATCH_SIZE));
    }

    console.log(`Total users: ${TWITTER_USERS.length}. Batches: ${chunks.length}`);

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`\nProcessing Batch ${i + 1}/${chunks.length} (${chunk.length} users)...`);

        // Process chunk in parallel? Or sequential? 
        // Cron does sequential inside chunk. We can do parallel for speed locally if API allows, 
        // but let's stick to sequential to be safe and match user's mental model.
        for (const username of chunk) {
            console.log(`Fetching ${username}...`);
            try {
                const tweets = await fetchUserTweets(username);
                console.log(`Got ${tweets.length} tweets.`);

                let count = 0;
                for (const tweet of tweets) {
                    const tweetId = tweet.id || tweet.conversationId;
                    if (!tweetId) continue;

                    await db.insert(tweetsRaw).values({
                        tweet_id: tweetId,
                        source: "twitterapi.io",
                        published_at: tweet.createdAt,
                        fetched_at: new Date().toISOString(),
                        lang: tweet.lang,
                        author_username: username,
                        retweet_count: tweet.retweetCount || 0,
                        reply_count: tweet.replyCount || 0,
                        like_count: tweet.likeCount || 0,
                        quote_count: tweet.quoteCount || 0,
                        view_count: tweet.viewCount || 0,
                        bookmark_count: tweet.bookmarkCount || 0,
                        raw_payload: JSON.stringify(tweet),
                    }).onConflictDoUpdate({
                        target: tweetsRaw.tweet_id,
                        set: {
                            retweet_count: tweet.retweetCount || 0,
                            reply_count: tweet.replyCount || 0,
                            like_count: tweet.likeCount || 0,
                            quote_count: tweet.quoteCount || 0,
                            view_count: tweet.viewCount || 0,
                            bookmark_count: tweet.bookmarkCount || 0,
                            fetched_at: new Date().toISOString(),
                            raw_payload: JSON.stringify(tweet)
                        }
                    });
                    count++;
                }
                console.log(`Upserted ${count} tweets.`);
            } catch (e: any) {
                console.error(`Error processing ${username}:`, e.message);
            }
        }

        // Wait if not last batch (SKIPPED per user request)
        /*
        if (i < chunks.length - 1) {
            console.log(`Batch ${i + 1} complete. Waiting ${RATE_LIMIT_DELAY / 1000}s for rate limits...`);
            await delay(RATE_LIMIT_DELAY);
        }
        */
    }

    // 2. News
    console.log("\n--- Fetching News ---");
    for (const url of RSS_FEEDS) {
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
                        summary_raw: item.contentSnippet || item.content?.substring(0, 500)
                    }
                });
                count++;
            }
            console.log(`Upserted ${count} news items.`);
        } catch (e: any) {
            console.error(`Error processing RSS ${url}:`, e.message);
        }
    }

    console.log("\nDone.");
    process.exit(0);
}

main();
