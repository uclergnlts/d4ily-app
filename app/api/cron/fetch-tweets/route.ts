import { NextResponse } from 'next/server';
import { runFetchTweets } from '@/lib/crons';
import { checkCronAuth } from '@/lib/cron-auth';

export const maxDuration = 300; // 5 minutes max duration for Vercel/Next.js

export async function GET(request: Request) {
    const unauthorized = checkCronAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const result = await runFetchTweets();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
