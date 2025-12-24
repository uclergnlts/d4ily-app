import { NextResponse } from "next/server";
import { runFetchNews } from "@/lib/crons";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await runFetchNews();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
