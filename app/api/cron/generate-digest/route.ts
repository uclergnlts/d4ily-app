import { NextResponse } from "next/server";
import { runGenerateDigest } from "@/lib/crons";
import { checkCronAuth } from "@/lib/cron-auth";

export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
    const unauthorized = checkCronAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const result = await runGenerateDigest();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Digest generation failed:", error);
        // Debugging: Logging environment status (masked)
        const envStatus = {
            TURSO_DB: !!process.env.TURSO_DATABASE_URL,
            GEMINI: !!process.env.GEMINI_API_KEY,
            TWITTER: !!process.env.TWITTER_API_KEY
        };
        console.log("Env Check:", envStatus);

        return NextResponse.json({
            error: error.message,
            stack: error.stack,
            envStatus
        }, { status: 500 });
    }
}
