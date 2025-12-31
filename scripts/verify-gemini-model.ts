
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    // Allow passing via env if .env.local fails
    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY is missing");
        process.exit(1);
    }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function run() {
    try {
        console.log("🚀 Testing Gemini 2.0 Flash connection...");
        const result = await model.generateContent("Hello, are you online?");
        const response = await result.response;
        const text = response.text();
        console.log("✅ Connection successful!");
        console.log("Response:", text);
    } catch (error: any) {
        console.error("❌ Error connecting to Gemini:", error.message);
    }
}

run();
