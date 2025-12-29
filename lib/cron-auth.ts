import { NextResponse } from "next/server";

/**
 * Checks if the request has valid cron authorization
 * Returns an error response if unauthorized, null if authorized
 */
export function checkCronAuth(request: Request): NextResponse | null {
    // Skip auth in development
    if (process.env.NODE_ENV === 'development') {
        return null;
    }

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
        console.error("Unauthorized cron request attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return null;
}
