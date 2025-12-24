import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyDigests, tweetsRaw, newsRaw } from "@/lib/db/schema";
import { generateDailyDigest } from "@/lib/ai";
import { fetchGoogleImage } from "@/lib/image-search";
import { TweetProcessor } from "@/lib/processor";
import { sql } from "drizzle-orm";

export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
    /* 
    // Secure via CRON_SECRET if needed
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }
    */

    try {
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // 1. Check if digest already exists for today
        // Note: In a real scenario, you might want to allow regeneration or multiple versions.
        // For now, we'll just log it but proceed (or could return early).

        // 2. Fetch Tweets (last 24 hours)
        // using SQLite date function for simplicity: datetime('now', '-1 day')
        const recentTweets = await db.select()
            .from(tweetsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`)
            .limit(200); // Increased for better context

        // 3. Fetch News (last 24 hours)
        const recentNews = await db.select()
            .from(newsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`)
            .limit(100);

        if (recentTweets.length === 0 && recentNews.length === 0) {
            return NextResponse.json({ message: "No new data to digest." }, { status: 200 });
        }

        console.log(`Generating digest for ${todayStr} with ${recentTweets.length} tweets and ${recentNews.length} news items.`);

        // 3.5 Pre-process Tweets (Smart Editor)
        // Dynamic import to avoid circular dep issues if any, though standard import is fine here.
        // Let's use the new processor.
        const processedTweets = TweetProcessor.process(recentTweets);
        console.log(`Smart Editor: Reduced ${recentTweets.length} -> ${processedTweets.length} tweets.`);

        // 4. Generate Content via Gemini
        const digestData = await generateDailyDigest(todayStr, processedTweets, recentNews);

        // 4.5 Fetch Cover Image
        const coverImageUrl = await fetchGoogleImage(digestData.title);

        // 5. Save to Database
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
            cover_image_url: coverImageUrl, // Added field
            date: todayStr,
        }).onConflictDoUpdate({
            target: dailyDigests.digest_date,
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

        return NextResponse.json({
            success: true,
            digest: digestData
        });

    } catch (error: any) {
        console.error("Digest generation failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
