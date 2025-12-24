import { config } from "dotenv";
import { createClient } from "@libsql/client";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    try {
        console.log("Inspecting tweets_raw schema...");
        const result = await client.execute("PRAGMA table_info(tweets_raw)");
        console.log(result.rows);
    } catch (e) {
        console.error(e);
    }
}

main();
