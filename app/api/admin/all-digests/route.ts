import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyDigests } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const digests = await db.select({
            id: dailyDigests.id,
            digest_date: dailyDigests.digest_date,
            title: dailyDigests.title,
            category: dailyDigests.category,
            published: dailyDigests.published,
            word_count: dailyDigests.word_count,
        })
            .from(dailyDigests)
            .orderBy(desc(dailyDigests.digest_date))
            .limit(100);

        return NextResponse.json({
            success: true,
            digests
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
