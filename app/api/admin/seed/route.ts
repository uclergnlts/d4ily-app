import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { twitterAccounts, rssSources } from '@/lib/db/schema';
import { PERSONAL_ACCOUNTS, CORPORATE_ACCOUNTS, RSS_FEEDS } from '@/lib/config/sources';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        if (secret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let twitterCount = 0;
        let rssCount = 0;

        // Populate Twitter accounts - Personal
        for (const username of PERSONAL_ACCOUNTS) {
            try {
                await db.insert(twitterAccounts).values({
                    username,
                    category: "kisisel",
                    is_active: true,
                    show_in_live_feed: true,
                    priority: 5,
                    added_by: "system"
                }).onConflictDoNothing();
                twitterCount++;
            } catch (e: any) {
                console.error(`Error inserting ${username}:`, e.message);
            }
        }

        // Populate Twitter accounts - Corporate
        for (const username of CORPORATE_ACCOUNTS) {
            try {
                await db.insert(twitterAccounts).values({
                    username,
                    category: "kurumsal",
                    is_active: true,
                    show_in_live_feed: false,
                    priority: 3,
                    added_by: "system"
                }).onConflictDoNothing();
                twitterCount++;
            } catch (e: any) {
                console.error(`Error inserting ${username}:`, e.message);
            }
        }

        // Populate RSS sources
        for (const url of RSS_FEEDS) {
            try {
                const name = new URL(url).hostname.replace('www.', '');
                await db.insert(rssSources).values({
                    url,
                    name,
                    category: "gundem",
                    is_active: true,
                    fetch_interval: 240,
                    added_by: "system"
                }).onConflictDoNothing();
                rssCount++;
            } catch (e: any) {
                console.error(`Error inserting ${url}:`, e.message);
            }
        }

        return NextResponse.json({
            success: true,
            twitter_accounts: twitterCount,
            rss_sources: rssCount,
            message: "Database populated successfully"
        });

    } catch (error: any) {
        console.error("Population error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
