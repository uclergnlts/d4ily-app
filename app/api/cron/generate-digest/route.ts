import { NextResponse } from "next/server";
import { runGenerateDigest } from "@/lib/crons";

export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
    // keeping it open or add auth check if preferred, original didn't emphasize it but good practice
    /* 
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }
    */

    try {
        const result = await runGenerateDigest();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Digest generation failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
