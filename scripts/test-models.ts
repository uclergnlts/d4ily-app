
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModel(modelName: string) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("No API Key");
        return;
    }
    const genAI = new GoogleGenerativeAI(key.trim());
    const model = genAI.getGenerativeModel({ model: modelName });

    const fs = require("fs");
    try {
        console.log(`Testing ${modelName}...`);
        const result = await model.generateContent("Hello");
        console.log(`✅ ${modelName}: Success`);
        fs.appendFileSync("model-test-results.txt", `✅ ${modelName}: Success\n`);
        return true;
    } catch (e: any) {
        console.log(`❌ ${modelName}: Failed - ${e.message}`);
        fs.appendFileSync("model-test-results.txt", `❌ ${modelName}: Failed - ${e.message}\n`);
        return false;
    }
}

async function main() {
    const models = [
        "gemini-2.5-flash",
        "gemini-flash-experimental",
        "gemini-1.5-pro",
        "gemini-pro"
    ];

    console.log("Using API Key:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 8) + "..." : "NONE");

    for (const m of models) {
        await testModel(m);
    }
}

main();
