import { NextResponse } from 'next/server';
import { runFetchTweets } from '@/lib/crons';
import { checkCronAuth } from '@/lib/cron-auth';

export const maxDuration = 300; // 5 minutes max duration for Vercel/Next.js

export async function GET(request: Request) {
    const unauthorized = checkCronAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
        const result = await runFetchTweets({
            force: searchParams.get("force") === "true",
            username: searchParams.get("username") ?? undefined,
            limit: limit && !Number.isNaN(limit) ? limit : undefined,
        });
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
