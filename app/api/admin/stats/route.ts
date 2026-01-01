
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyDigests, tweetsRaw, newsRaw, processedArticles, officialGazetteSummaries } from "@/lib/db/schema";
import { sql, desc, and, notInArray, inArray } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Last Digest Status
        const lastDigest = await db.select().from(dailyDigests).orderBy(desc(dailyDigests.digest_date)).limit(1);

        // 2. Last Gazette Status
        const lastGazette = await db.select().from(officialGazetteSummaries).orderBy(desc(officialGazetteSummaries.date)).limit(1);

        // 3. Data Counts (Last 24h)
        const tweetCountResult = await db.select({ count: sql<number>`count(*)` })
            .from(tweetsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`);

        const newsCountResult = await db.select({ count: sql<number>`count(*)` })
            .from(processedArticles) // Use processedArticles for accurate categorized count
            .where(and(
                sql`processed_at >= datetime('now', '-1 day')`,
                notInArray(processedArticles.category, ['Makale', 'Analiz'])
            ));

        const articleCountResult = await db.select({ count: sql<number>`count(*)` })
            .from(processedArticles)
            .where(and(
                sql`processed_at >= datetime('now', '-1 day')`,
                inArray(processedArticles.category, ['Makale', 'Analiz'])
            ));

        // 4. System Health
        const health = {
            status: lastDigest.length > 0 ? "operational" : "unknown",
            lastRun: lastDigest[0]?.updated_at || lastDigest[0]?.created_at || "Never",
            message: "System is running normally."
        };

        return NextResponse.json({
            success: true,
            stats: {
                lastDigest: lastDigest[0] || null,
                lastGazette: lastGazette[0] || null,
                metrics: {
                    tweets_24h: tweetCountResult[0].count,
                    news_24h: newsCountResult[0].count,
                    articles_24h: articleCountResult[0].count
                },
                health
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
