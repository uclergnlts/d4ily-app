import { NextResponse } from "next/server";
import { runGenerateWeeklyDigest } from "@/lib/crons";
import { checkCronAuth } from "@/lib/cron-auth";

export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
    const unauthorized = checkCronAuth(request);
    if (unauthorized) return unauthorized;

    try {
        const result = await runGenerateWeeklyDigest();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Weekly digest generation failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
