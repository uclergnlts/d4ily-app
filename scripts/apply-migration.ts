import { createClient } from "@libsql/client";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
config({ path: ".env.local" });

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
    const migrationPath = path.join(process.cwd(), "migrations/0000_little_nebula.sql");
    console.log("Reading migration file:", migrationPath);

    if (!fs.existsSync(migrationPath)) {
        console.error("Migration file not found!");
        process.exit(1);
    }

    const sqlContent = fs.readFileSync(migrationPath, "utf-8");

    // Drizzle uses this separator
    const statements = sqlContent.split("--> statement-breakpoint");

    console.log(`Found ${statements.length} statements to execute.`);

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (!statement) continue;

        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        try {
            await client.execute(statement);
            console.log("Success.");
        } catch (e: any) {
            if (e.message?.includes("already exists")) {
                console.log("Skipping (already exists).");
            } else {
                console.error("Error executing statement:", e.message);
                // Optionally throw to stop
                // throw e;
            }
        }
    }

    console.log("Migration script finished.");
}

main().catch((err) => {
    console.error("Script failed:", err);
    process.exit(1);
});
