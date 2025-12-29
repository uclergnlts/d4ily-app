
import { NextRequest, NextResponse } from "next/server";
import { processLatestNews } from "@/lib/services/news-processor";
import { checkCronAuth } from "@/lib/cron-auth";

export const maxDuration = 300; // 5 minutes

export async function GET(req: NextRequest) {
    const authError = checkCronAuth(req);
    if (authError) {
        return authError;
    }

    try {
        // Process up to 10 articles per run
        await processLatestNews(10);
        return NextResponse.json({ message: "Reading and processing completed." });
    } catch (error: any) {
        console.error("News processing failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
