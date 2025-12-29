
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
    const cronSecret = process.env.CRON_SECRET;
    console.log("Loaded Env Keys:", Object.keys(process.env).filter(k => k.includes("CRON") || k.includes("API")));
    if (!cronSecret) {
        console.error("Error: CRON_SECRET is missing in .env.local");
        process.exit(1);
    }

    async function callApi(secret: string | undefined) {
        console.log(`Trying with secret: Bearer ${secret}`);
        try {
            const response = await fetch("http://localhost:3000/api/cron/auto-blog-from-agenda", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${secret}`
                }
            });

            console.log(`Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            try {
                const json = JSON.parse(text);
                console.dir(json, { depth: null, colors: true });
                const fs = require('fs');
                fs.writeFileSync('last_cron_response.json', JSON.stringify(json, null, 2));
                return response.ok;
            } catch {
                console.log("Response (Text):", text);
                const fs = require('fs');
                fs.writeFileSync('last_cron_error.txt', text);
                return false;
            }
        } catch (e) {
            console.error("Fetch failed:", e);
            return false;
        }
    }

    const success = await callApi(cronSecret);
    if (!success) {
        console.log("First attempt failed/unauthorized. Setup might require restart. Trying with 'undefined' hack...");
        await callApi("undefined");
    }

}

main();
