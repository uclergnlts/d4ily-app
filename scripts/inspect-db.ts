
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function inspect() {
    console.log("DB_URL:", process.env.DB_URL);
    console.log("DB_AUTH_TOKEN:", process.env.DB_AUTH_TOKEN ? "***" : "undefined");

    try {
        const tables = await db.run(sql`SELECT type, name, sql FROM sqlite_master WHERE type IN ('table', 'index')`);
        // @ts-ignore
        tables.rows.forEach(row => {
            console.log(`[${row.type}] ${row.name}`);
        });
    } catch (e) {
        console.error("Inspection failed:", e);
    }
}
inspect();
