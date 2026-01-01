import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // Check if we are in the admin area
    if (req.nextUrl.pathname.startsWith("/admin")) {
        // Check for Seed/Cron API routes - these should be protected by CRON_SECRET, not Basic Auth
        // Generally cron jobs utilize /api/cron/*, but if any admin API is called by system, we might need exceptions.
        // However, usually /admin is for UI. API routes are under /api/admin.
        // If /api/admin/* is used by client-side admin panel, it sends cookies/headers.
        // Basic Auth prompt works for browser navigation.

        const basicAuth = req.headers.get("authorization");
        const url = req.nextUrl;

        if (basicAuth) {
            const authValue = basicAuth.split(" ")[1];
            const [user, pwd] = atob(authValue).split(":");

            const validUser = process.env.ADMIN_USERNAME;
            const validPass = process.env.ADMIN_PASSWORD;

            if (user === validUser && pwd === validPass) {
                return NextResponse.next();
            }
        }

        url.pathname = "/api/auth";
        return new NextResponse("Auth Required", {
            status: 401,
            headers: {
                "WWW-Authenticate": 'Basic realm="Secure Area"',
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
