import { NextResponse } from 'next/server';
import { runFetchTweets, runFetchNews, runGenerateDigest } from '@/lib/crons';
import { checkCronAuth } from '@/lib/cron-auth';

export const maxDuration = 300; // 5 minutes max duration for Vercel Hobby

export async function GET(request: Request) {
    const unauthorized = checkCronAuth(request);
    if (unauthorized) return unauthorized;

    const now = new Date();
    const hour = now.getUTCHours();

    const results: any = {
        timestamp: now.toISOString(),
        hour_utc: hour,
        tasks_run: []
    };

    // Schedule Logic:
    // 1. Fetch Tweets & News: Every 4 hours (0, 4, 8, 12, 16, 20)
    if (hour % 4 === 0) {
        console.log(`[Master Cron] Hour ${hour}: Running fetch tasks...`);
        try {
            const [tweets, news] = await Promise.all([
                runFetchTweets(),
                runFetchNews()
            ]);
            results.fetch_tweets = tweets;
            results.fetch_news = news;
            results.tasks_run.push('fetch-tweets', 'fetch-news');
        } catch (e: any) {
            console.error("[Master Cron] Fetch error:", e);
            results.fetch_error = e.message;
        }
    }

    // 2. Generate Digest: At 06:00 UTC
    if (hour === 6) {
        console.log(`[Master Cron] Hour ${hour}: Generating digest...`);
        try {
            const digest = await runGenerateDigest();
            results.generate_digest = digest;
            results.tasks_run.push('generate-digest');
        } catch (e: any) {
            console.error("[Master Cron] Digest error:", e);
            results.digest_error = e.message;
        }
    }

    if (results.tasks_run.length === 0) {
        results.message = "No tasks scheduled for this hour.";
    }

    return NextResponse.json(results);
}
