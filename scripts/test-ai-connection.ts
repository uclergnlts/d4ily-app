import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
    console.log("Checking available models...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
        // There isn't a direct listModels method on the client instance in all versions, 
        // but let's try a simple generation to see specific error detail.
        console.log("Attempting generation with gemini-1.5-flash...");
        const result = await model.generateContent("Hello");
        console.log("Success:", await result.response.text());
    } catch (e: any) {
        console.error("Error with gemini-1.5-flash:", e.message);
        console.error("Full Error:", JSON.stringify(e, null, 2));
    }
}

main();
