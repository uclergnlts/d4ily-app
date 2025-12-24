
import { db } from '../lib/db';
import { dailyDigests } from '../lib/db/schema';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function importJson() {
    console.log('🚀 Starting JSON import...');

    const jsonPath = path.resolve(process.cwd(), 'archive-data.json');
    if (!fs.existsSync(jsonPath)) {
        console.error('❌ archive-data.json not found!');
        return;
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const digests = JSON.parse(rawData);

    console.log(`Found ${digests.length} items to import.`);

    for (const item of digests) {
        try {
            // Validate essential fields
            if (!item.date || !item.content) {
                console.warn(`⚠️  Skipping item with missing date or content.`);
                continue;
            }

            console.log(`📥 Importing ${item.date}...`);

            await db.insert(dailyDigests).values({
                digest_date: item.date,
                title: item.title || `Gündem - ${item.date}`,
                intro: item.intro || item.content.substring(0, 150) + '...',
                content: item.content,
                tweets_count: item.tweets_count || 0,
                news_count: item.news_count || 0,
                model_name: 'json-import',
                status: 'generated',
                cover_image_url: item.cover_image_url || null,
                created_at: new Date(item.date).toISOString(),
            }).onConflictDoUpdate({
                target: dailyDigests.digest_date,
                set: {
                    content: item.content,
                    title: item.title,
                    intro: item.intro,
                    updated_at: new Date().toISOString()
                }
            });

            console.log(`✅ Imported/Updated ${item.date}`);
        } catch (error) {
            console.error(`❌ Failed to import ${item.date}:`, error);
        }
    }

    console.log('🎉 Import completed!');
}

importJson();
