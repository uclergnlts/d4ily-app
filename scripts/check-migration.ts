
import { db } from '../lib/db';
import { dailyDigests } from '../lib/db/schema';
import { sql, eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    console.log("Checking migrated digests...");
    const rows = await db.select({
        date: dailyDigests.digest_date,
        title: dailyDigests.title,
        content: dailyDigests.content
    })
        .from(dailyDigests)
        .where(eq(dailyDigests.model_name, 'legacy-migration'));

    console.log(`Found ${rows.length} migrated rows.`);

    for (const row of rows) {
        console.log(`\n--- ${row.date} ---`);
        console.log(`Title: ${row.title}`);
        console.log(`Content Length: ${row.content?.length}`);
        console.log(`Snippet: ${row.content?.substring(0, 100)}...`);
    }
}

check();
