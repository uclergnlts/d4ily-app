
import { NextResponse } from 'next/server';
import { runFetchTweets, runFetchNews } from '@/lib/crons';
import { db } from '@/lib/db';
import { tweetsRaw, newsRaw } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute allowed for manual trigger

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        if (secret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized: Invalid ADMIN_SECRET' }, { status: 401 });
        }

        const type = searchParams.get('type') || 'all'; // 'tweets', 'news', or 'all'
        const results: any = {};

        // 1. Environment Check
        results.envCheck = {
            TWITTER_API_KEY_EXISTS: !!process.env.TWITTER_API_KEY,
            TWITTER_API_KEY_PREFIX: process.env.TWITTER_API_KEY ? process.env.TWITTER_API_KEY.substring(0, 4) + '...' : 'MISSING',
            DB_CONNECTION: 'OK' // If we reached here, DB connection is likely fine (Next.js init)
        };

        // 2. Run Fetch
        if (type === 'tweets' || type === 'all') {
            try {
                console.log("Starting manual tweet fetch...");
                results.tweets = await runFetchTweets();
            } catch (e: any) {
                results.tweets = { success: false, error: e.message };
            }
        }

        if (type === 'news' || type === 'all') {
            try {
                console.log("Starting manual news fetch...");
                results.news = await runFetchNews();
            } catch (e: any) {
                results.news = { success: false, error: e.message };
            }
        }

        // 3. Database Stats
        try {
            const tweetCount = await db.select({ count: sql<number>`count(*)` }).from(tweetsRaw);
            const newsCount = await db.select({ count: sql<number>`count(*)` }).from(newsRaw);
            results.dbStats = {
                totalTweets: tweetCount[0].count,
                totalNews: newsCount[0].count
            };
        } catch (e: any) {
            results.dbStats = { error: `DB Count Failed: ${e.message}` };
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            ...results
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
