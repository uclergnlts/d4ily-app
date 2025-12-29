
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Testing Gemini API Key:", key ? "Present" : "Missing");

    if (!key) return;

    const genAI = new GoogleGenerativeAI(key);

    // Test 1: gemini-1.5-flash
    try {
        console.log("Testing model: gemini-1.5-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success gemini-1.5-flash:", result.response.text());
    } catch (e: any) {
        console.error("Fail gemini-1.5-flash:", e.message);
    }

    // Test 2: gemini-flash-latest
    try {
        console.log("Testing model: gemini-flash-latest");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello");
        console.log("Success gemini-flash-latest:", result.response.text());
    } catch (e: any) {
        console.error("Fail gemini-flash-latest:", e.message);
    }

    // Test 3: gemini-1.5-flash with JSON mode
    try {
        console.log("Testing model: gemini-1.5-flash (JSON Mode)");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
        const result = await model.generateContent("Return JSON: { \"test\": true }");
        console.log("Success gemini-1.5-flash JSON:", result.response.text());
    } catch (e: any) {
        console.error("Fail gemini-1.5-flash JSON:", e.message);
    }
}

main();
