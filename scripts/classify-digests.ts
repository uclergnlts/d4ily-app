
import * as dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@libsql/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

const CATEGORIES = {
    politics: {
        label: "Siyaset",
        keywords: ["meclis", "parti", "erdoğan", "özel", "bahçeli", "chp", "akp", "mhp", "iyi parti", "dem parti", "oy", "seçim", "bakan", "cumhurbaşkanı", "siyaset", "vekil", "anayasa", "kayyum", "görüşme"]
    },
    economy: {
        label: "Ekonomi",
        keywords: ["dolar", "euro", "altın", "borsa", "bist", "faiz", "enflasyon", "zam", "asgari ücret", "memur", "emekli", "merkez bankası", "ekonomi", "piyasa", "kripto", "bitcoin"]
    },
    sports: {
        label: "Spor",
        keywords: ["maç", "gol", "fenerbahçe", "galatasaray", "beşiktaş", "trabzonspor", "milli takım", "voleybol", "futbol", "basketbol", "lig", "şampiyon", "transfer", "hakem", "derbi"]
    }
};

async function main() {
    console.log("🔌 Connecting to DB...");

    // 1. Ensure Column Exists (Manual Migration)
    try {
        await client.execute("ALTER TABLE daily_digests ADD COLUMN category TEXT DEFAULT 'gundem'");
        console.log("✅ Added 'category' column.");
    } catch (e: any) {
        if (e.message.includes("duplicate column")) {
            console.log("ℹ️ 'category' column already exists.");
        } else {
            console.error("⚠️ Column creation error (might be fine):", e.message);
        }
    }

    // 2. Fetch Digests
    const result = await client.execute("SELECT id, title, content FROM daily_digests");
    const digests = result.rows;

    console.log(`🔍 Classifying ${digests.length} digests...`);

    let updates = 0;

    for (const digest of digests) {
        const text = ((digest.title as string) + " " + (digest.content as string)).toLowerCase();
        let category = "gundem"; // default

        // Score categories
        let scores: Record<string, number> = { politics: 0, economy: 0, sports: 0 };

        for (const [key, conf] of Object.entries(CATEGORIES)) {
            for (const word of conf.keywords) {
                if (text.includes(word)) {
                    scores[key]++;
                }
            }
        }

        // Determine winner
        const maxScore = Math.max(...Object.values(scores));
        if (maxScore > 0) {
            const winner = Object.entries(scores).find(([k, v]) => v === maxScore);
            if (winner) category = winner[0];
        }

        // Special case: If politics and economy are close, politics usually wins in "Agenda" context, 
        // but if economy score is high enough (e.g. > 3), let's say it's economy.

        await client.execute({
            sql: "UPDATE daily_digests SET category = ? WHERE id = ?",
            args: [category, digest.id]
        });

        // console.log(`Digest ${digest.id}: ${category} (Scores: ${JSON.stringify(scores)})`);
        updates++;
    }

    console.log(`✅ Updated ${updates} digests with categories.`);
}

main();
