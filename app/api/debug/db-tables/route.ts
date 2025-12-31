import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table';`);
        return NextResponse.json({
            success: true,
            tables: result.rows
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
