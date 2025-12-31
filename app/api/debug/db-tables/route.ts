import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        let message = "Listing tables";

        if (action === 'create_logs_table') {
            await db.run(sql`
                CREATE TABLE IF NOT EXISTS blog_generation_logs (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    run_date text DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    selected_topic text NOT NULL,
                    cluster text,
                    evergreen_score integer,
                    result text NOT NULL,
                    reason text,
                    generated_post_id integer
                );
            `);
            message = "Created blog_generation_logs table";
        }

        const result = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table';`);
        return NextResponse.json({
            success: true,
            message,
            tables: result.rows
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
