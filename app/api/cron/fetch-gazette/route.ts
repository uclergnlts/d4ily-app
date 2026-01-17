import { NextResponse } from 'next/server';
import { runFetchOfficialGazette } from '@/lib/crons';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const maxDuration = 60; // Allow up to 60 seconds for this function

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', {
                status: 401,
            });
        }

        const result = await runFetchOfficialGazette();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Fetch Gazette Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
            stepLogs: error.stepLogs || []
        }, { status: 500 });
    }
}

