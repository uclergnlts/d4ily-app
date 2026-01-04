
import { runFetchOfficialGazette } from "../lib/crons";
import * as dotenv from 'dotenv';
dotenv.config();

async function testCron() {
    console.log("Testing runFetchOfficialGazette...");
    try {
        const result = await runFetchOfficialGazette();
        console.log("Success:", result);
    } catch (error) {
        console.error("CRON FAILED:", error);
        if (error instanceof Error) {
            console.error("Stack:", error.stack);
        }
    }
}

testCron();
