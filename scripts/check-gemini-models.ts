
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables from .env or .env.local
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing via process.env");
    // console.log("Please provide it via GEMINI_API_KEY env var");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Listing available models...");
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey; // Hack to just access the client, but actually we need listModels on the client usually? 
        // Wait, node sdk architecture:
        // usually it's genAI.makeRequest or similar?
        // Actually, checking docs:
        // import { GoogleGenerativeAI } from "@google/generative-ai";
        // const genAI = new GoogleGenerativeAI(API_KEY);
        // const model = genAI.getGenerativeModel({ model: "MODEL_NAME" });

        // There isn't a direct listModels on the main class in some versions, but let's try to infer or use the fetch directly if needed.
        // But verifying with documentation, newer versions might not have listModels exposed easily or it's on a different manager.
        // Error message said: "Call ListModels to see the list of available models"

        // Let's try to just fetch via REST if SDK doesn't support it easily, or assume we can't.
        // However, I will write a script that tries to run a known supported model like 'gemini-pro' just to see if ANY works.

        // Better: I will create a script that tries multiple potential model names.
    } catch (e) {

    }
}

async function testModel(modelName: string) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`✅ ${modelName} is working!`);
        return true;
    } catch (e: any) {
        console.log(`❌ ${modelName} failed: ${e.message.split('\n')[0]}`);
        return false;
    }
}

async function run() {
    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro",
        "gemini-1.5-pro-latest",
        "gemini-1.5-pro-001",
        "gemini-1.5-pro-002",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    console.log(`Checking ${candidates.length} models with key ending in ...${apiKey.slice(-4)}`);

    for (const m of candidates) {
        await testModel(m);
    }
}

run();
