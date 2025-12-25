import { NextResponse } from "next/server";
import { runFetchNews } from "@/lib/crons";
import { checkCronAuth } from "@/lib/cron-auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const unauthorized = checkCronAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const result = await runFetchNews();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
