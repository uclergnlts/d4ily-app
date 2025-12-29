
import { NextResponse } from "next/server";

export async function GET() {
    const geminiKey = process.env.GEMINI_API_KEY;
    const cronSecret = process.env.CRON_SECRET;

    return NextResponse.json({
        geminiKey: geminiKey ? `${geminiKey.substring(0, 5)}...${geminiKey.slice(-5)}` : "MISSING",
        geminiKeyLength: geminiKey ? geminiKey.length : 0,
        cronSecret: cronSecret ? `${cronSecret.substring(0, 5)}...` : "MISSING",
        nodeEnv: process.env.NODE_ENV
    });
}
