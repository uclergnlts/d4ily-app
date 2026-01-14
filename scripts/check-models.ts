
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
    console.log("Listing available models...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // There isn't a direct "listModels" on the instance in some SDK versions, 
        // but let's try a standard model request and see if we can infer or if there's a manager.
        // Actually, the SDK has a ModelManager usually, but let's just try to call a known model.

        console.log("Testing gemini-2.5-flash...");
        try {
            const model25 = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result25 = await model25.generateContent("Test");
            console.log("✅ gemini-2.5-flash exists and responded.");
        } catch (e: any) {
            console.error("❌ gemini-2.5-flash failed:", e.message);
        }

        console.log("Testing gemini-1.5-flash...");
        try {
            const model15 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result15 = await model15.generateContent("Test");
            console.log("✅ gemini-1.5-flash exists and responded.");
        } catch (e: any) {
            console.error("❌ gemini-1.5-flash failed:", e.message);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}
main();
