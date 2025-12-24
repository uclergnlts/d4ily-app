import { config } from "dotenv";
import { resolve } from "path";
import { sql } from "drizzle-orm";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    const { db } = await import("@/lib/db");
    const { dailyDigests } = await import("@/lib/db/schema");

    try {
        const count = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(dailyDigests);
        console.log(`Daily Digests Count: ${count[0].count}`);

        const latest = await db.select().from(dailyDigests).orderBy(sql`${dailyDigests.id} DESC`).limit(1);
        if (latest.length > 0) {
            console.log("Latest Digest Title:", latest[0].title);
            console.log("Latest Digest Model:", latest[0].model_name);
        }

    } catch (e) {
        console.error(e);
    }
}

main();
