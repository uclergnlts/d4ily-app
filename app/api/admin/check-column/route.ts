import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const info = await db.run(sql.raw("PRAGMA table_info(twitter_accounts)"));

        // Output format of PRAGMA table_info in LibSQL/Drizzle?
        // Drizzle .run returns ResultSet.
        // But PRAGMA returns rows. .run might not return rows in all drivers?
        // .all() is better for fetching rows in LibSQL.
        // Drizzle-orm/libsql doesn't expose .all directly on db? 
        // We can use db.all() if we cast or use the client directly?
        // db is drizzle(client).
        // We can do db.select().from(sql`PRAGMA table_info(twitter_accounts)`)? No.

        // Let's try to just select the column from one row.
        try {
            await db.run(sql.raw("SELECT show_in_live_feed FROM twitter_accounts LIMIT 1"));
            return NextResponse.json({ status: "Column exists", success: true });
        } catch (e: any) {
            return NextResponse.json({ status: "Column missing", error: e.message });
        }

    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
