import { NextResponse } from 'next/server';
import { fetchUserTweets } from '@/lib/twitter';
import { db } from '@/lib/db';
import { tweetsRaw } from '@/lib/db/schema';
import { TWITTER_USERS } from '@/lib/config/sources';

export const maxDuration = 300; // 5 minutes max duration for Vercel/Next.js

export async function GET(request: Request) {
    // Basic authorization check (add CRON_SECRET to env for prod)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("Starting scheduled tweet fetch...");

    let totalFetched = 0;
    let totalInserted = 0;
    const errors: string[] = [];

    // OPTIMIZATION: Process a random subset of users per run to ensure coverage over time
    // Shuffle array first
    const shuffled = [...TWITTER_USERS].sort(() => 0.5 - Math.random());
    const usersToProcess = shuffled.slice(0, 20);

    console.log(`Processing ${usersToProcess.length} users (random selection) out of ${TWITTER_USERS.length} total`);

    // Process in batches of 5 for parallel execution
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

        // Small delay between batches
        if (i + BATCH_SIZE < usersToProcess.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return NextResponse.json({
        success: true,
        message: `Fetched ${totalFetched} tweets, inserted ${totalInserted} new ones.`,
        processed: usersToProcess.length,
        total_users: TWITTER_USERS.length,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
    });
}
