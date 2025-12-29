
import { db } from "../lib/db";
import { weeklyDigests } from "../lib/db/schema";
import { desc } from "drizzle-orm";

async function checkWeeklyDigests() {
    console.log("Checking weekly_digests table...");
    try {
        const digests = await db.select().from(weeklyDigests).orderBy(desc(weeklyDigests.created_at));
        console.log(`Found ${digests.length} weekly digests.`);
        digests.forEach(d => {
            console.log("---");
            console.log("ID:", d.id);
            console.log("WeekID:", d.week_id);
            console.log("Title:", d.title);
            console.log("Status:", d.status);
            console.log("Created At:", d.created_at);
        });
    } catch (e: any) {
        console.error("Error fetching weekly digests:", e.message);
    }
}

checkWeeklyDigests().catch(console.error);
