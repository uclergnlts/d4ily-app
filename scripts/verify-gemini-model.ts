
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
    try {
        console.log("🚀 Testing Gemini 1.5 Flash connection...");
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
