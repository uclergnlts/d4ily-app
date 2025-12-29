import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing in .env.local");
    process.exit(1);
}

async function listModels() {
    try {
        console.log(`🔑 Using API Key: ${API_KEY!.substring(0, 8)}...`);
        console.log("🌐 Fetching available models from Google API...");

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY!}`;
        const response = await axios.get(url);

        if (response.data && response.data.models) {
            console.log("\n✅ Available Models (Simple List):");
            response.data.models.forEach((m: any) => {
                console.log(`- Name: ${m.name}`);
                console.log(`  Display: ${m.displayName}`);
                console.log(`  Methods: ${m.supportedGenerationMethods.join(", ")}`);
                console.log("---");
            });
        } else {
            console.log("⚠️ No models found in response:", response.data);
        }
    } catch (error: any) {
        console.error("❌ Error fetching models:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

listModels();
