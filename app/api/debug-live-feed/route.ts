import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { twitterAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const liveAccounts = await db.select().from(twitterAccounts).where(eq(twitterAccounts.show_in_live_feed, true));

        const t24 = await db.select().from(twitterAccounts).where(eq(twitterAccounts.username, "t24comtr"));

        return NextResponse.json({
            t24_record: t24,
            live_accounts_count: liveAccounts.length,
            live_accounts_usernames: liveAccounts.map(a => a.username)
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
