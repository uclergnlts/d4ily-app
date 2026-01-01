import { NextResponse } from 'next/server';
import { runFetchOfficialGazette } from '@/lib/crons';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

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
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
