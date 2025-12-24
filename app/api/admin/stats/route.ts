
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyDigests, tweetsRaw, newsRaw } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Last Digest Status
        const lastDigest = await db.select().from(dailyDigests).orderBy(desc(dailyDigests.digest_date)).limit(1);

        // 2. Data Counts (Last 24h)
        const tweetCountResult = await db.select({ count: sql<number>`count(*)` })
            .from(tweetsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`);

        const newsCountResult = await db.select({ count: sql<number>`count(*)` })
            .from(newsRaw)
            .where(sql`fetched_at >= datetime('now', '-1 day')`);

        // 3. System Health (Mock logic for now, could be real logs)
        const health = {
            status: lastDigest.length > 0 ? "operational" : "unknown",
            lastRun: lastDigest[0]?.updated_at || lastDigest[0]?.created_at || "Never",
            message: "System is running normally."
        };

        return NextResponse.json({
            success: true,
            stats: {
                lastDigest: lastDigest[0] || null,
                metrics: {
                    tweets_24h: tweetCountResult[0].count,
                    news_24h: newsCountResult[0].count,
                },
                health
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
