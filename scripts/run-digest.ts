import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testDigestGeneration() {
    console.log("🚀 Testing Digest Generation (with Processed Articles)\n");

    const { runGenerateDigest } = await import("../lib/crons");

    try {
        const result = await runGenerateDigest();
        console.log("\n✅ DIGEST GENERATION SUCCESS!\n");
        console.log(JSON.stringify(result, null, 2));
    } catch (error: any) {
        console.error("\n❌ DIGEST GENERATION FAILED:\n");
        console.error(error.message);
        console.error(error.stack);
    }
}

testDigestGeneration();
