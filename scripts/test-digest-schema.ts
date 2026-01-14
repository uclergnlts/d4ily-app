
import { generateDailyDigest } from "../lib/ai";
import dotenv from "dotenv";
import path from "path";

// Load env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
    console.log("Testing generateDailyDigest with Schema...");

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY not found in .env.local!");
        // process.exit(1); // Don't exit, just warn, maybe system env has it?
    } else {
        console.log("GEMINI_API_KEY found.");
    }

    const dummyTweets = [
        { author_username: "ekonomist", raw_payload: { text: "Merkez Bankası faiz kararını açıkladı. Piyasalar olumlu tepki verdi." }, like_count: 100 },
        { author_username: "haberci", raw_payload: { text: "İstanbul'da beklenen kar yağışı başladı." }, like_count: 500 },
        { author_username: "teknoloji", raw_payload: { text: "Yerli otomobil TOGG yeni modelini tanıttı." }, like_count: 250 }
    ];

    const dummyNews = [
        {
            title: "Merkez Bankası Faiz Kararı",
            source_name: "Ekonomi Haber",
            category: "Ekonomi",
            summary: "Merkez Bankası politika faizini %45 seviyesinde sabit tuttu.",
            image_url: "http://example.com/img.jpg"
        },
        {
            title: "İstanbul'da Kar Alarmı",
            source_name: "Hava Durumu",
            category: "Yaşam",
            summary: "Meteoroloji uyardı: Akşam saatlerinde yoğun kar bekleniyor.",
            image_url: null
        }
    ];

    try {
        console.log("Calling generateDailyDigest...");
        const data = await generateDailyDigest("2024-01-14", dummyTweets, dummyNews);
        console.log("\n--- GEMINI RESPONSE ---\n");
        console.log(JSON.stringify(data, null, 2));
        console.log("\n-----------------------\n");

        // Basic validation
        if (typeof data.title === 'string' && Array.isArray(data.trends) && Array.isArray(data.watchlist)) {
            console.log("✅ Validation Passed: Schema structure is correct and parsing succeeded.");
        } else {
            console.error("❌ Validation Failed: Structure mismatch.");
            console.error("Received keys:", Object.keys(data));
            process.exit(1);
        }

    } catch (e: any) {
        console.error("❌ Error executing digest generation:", e);
        process.exit(1);
    }
}

main();
