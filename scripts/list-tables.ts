import { createClient } from "@libsql/client";
import { config } from "dotenv";
config({ path: ".env.local" });

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
    console.log("Connecting to:", process.env.TURSO_DATABASE_URL);
    try {
        const rs = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
        console.log("Tables found:", rs.rows.map(r => r.name));
    } catch (e) {
        console.error("Error:", e);
    }
}
main();
