
import { runGenerateDigest } from "../lib/crons";
import dotenv from "dotenv";
import path from "path";

// Load env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
    console.log("Starting manual digest generation...");

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY not found!");
        process.exit(1);
    }

    if (!process.env.TURSO_DATABASE_URL) {
        console.error("TURSO_DATABASE_URL not found!");
        process.exit(1);
    }

    try {
        const result = await runGenerateDigest();
        console.log("\n--- DIGEST GENERATION RESULT ---\n");
        console.log(JSON.stringify(result, null, 2));

        if (result.success) {
            console.log("\n✅ Digest generated and saved successfully.");
        } else {
            console.log("\n⚠️ Digest generation finished but success flag is false/missing?");
        }

    } catch (e: any) {
        console.error("❌ Error executing manual digest:", e);
        if (e.stepLogs) {
            console.error("Step Logs:", e.stepLogs);
        }
        process.exit(1);
    }
}

main();
