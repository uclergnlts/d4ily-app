import { sql, like, or, eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function fixTitles() {
    console.log('🚀 Starting Title Fixer...');

    // Dynamic import
    const { db } = await import('../lib/db');
    const { dailyDigests } = await import('../lib/db/schema');

    // Select digests with generic titles either from migration or manual import
    // "Gündem - YYYY-MM-DD" or similar
    const digests = await db.select()
        .from(dailyDigests)
        .where(
            or(
                like(dailyDigests.title, 'Gündem%'),
                like(dailyDigests.title, 'Türkiye Gündemi%'),
                eq(dailyDigests.model_name, 'json-folder-import'),
                eq(dailyDigests.model_name, 'legacy-migration')
            )
        );

    console.log(`Found ${digests.length} digests to optimize.`);

    for (const digest of digests) {
        try {
            if (!digest.content || digest.content.length < 50) {
                console.warn(`⚠️ Skipping ${digest.digest_date} (content too short)`);
                continue;
            }

            // Check if title is already good (heuristic: doesn't start with Gündem and not null)
            if (digest.title && !digest.title.match(/Gündem|Türkiye Gündemi/i) && digest.title.length > 20) {
                // Optional: skip if already looks custom. But user asked to fix them.
                // Let's force update if it matches our criteria
            }

            console.log(`🤖 Generating title for ${digest.digest_date}...`);

            const prompt = `
            TASK: Generate a single, powerful, professional news headline (max 100 chars) in Turkish for the daily digest below.
            CONTEXT: This is a summary of Turkey's daily agenda.
            TONE: Objective, journalistic, catchy. NO clickbait.
            CONSTRAINT: Do NOT use "Gündem", "Özet" or the Date in the title. Focus on the main event.
            
            CONTENT:
            ${digest.content.substring(0, 3000)}
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let newTitle = response.text().trim();

            // Clean up formatting quotes if any
            newTitle = newTitle.replace(/^"|"$/g, '').replace(/\*\*/g, '');

            console.log(`   ✨ Old: ${digest.title}`);
            console.log(`   🌟 New: ${newTitle}`);

            await db.update(dailyDigests)
                .set({ title: newTitle })
                .where(eq(dailyDigests.id, digest.id));

            // Rate limit
            await new Promise(r => setTimeout(r, 1000));

        } catch (error) {
            console.error(`❌ Error processing ${digest.digest_date}:`, error);
        }
    }

    console.log('🎉 Title optimization completed!');
}

fixTitles();
