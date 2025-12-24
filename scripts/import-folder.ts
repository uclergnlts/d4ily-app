
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function importFolder() {
    console.log('🚀 Starting Folder Import...');

    // Dynamic import
    const { db } = await import('../lib/db');
    const { dailyDigests } = await import('../lib/db/schema');

    const folderPath = path.resolve(process.cwd(), 'eski_veri');
    if (!fs.existsSync(folderPath)) {
        console.error('❌ eski_veri folder not found!');
        return;
    }

    const files = fs.readdirSync(folderPath);
    console.log(`Found ${files.length} files in eski_veri.`);

    for (const file of files) {
        if (!file.includes('.json')) continue;

        const filePath = path.join(folderPath, file);
        try {
            const rawData = fs.readFileSync(filePath, 'utf-8');
            let data = JSON.parse(rawData);

            // Handle array or single object
            if (!Array.isArray(data)) {
                data = [data];
            }

            for (const item of data) {
                if (!item.digest_date || !item.content) {
                    console.warn(`⚠️  Skipping item in ${file} (missing date/content)`);
                    continue;
                }

                // Title fix (sometimes null in archive)
                const title = item.title || `Gündem - ${item.digest_date}`;

                // Content fix (ensure string)
                const content = typeof item.content === 'string' ? item.content : JSON.stringify(item.content);

                console.log(`📥 Importing ${item.digest_date} from ${file}...`);

                await db.insert(dailyDigests).values({
                    digest_date: item.digest_date,
                    title: title,
                    intro: item.intro || content.substring(0, 150) + '...',
                    content: content,
                    tweets_count: item.tweets_count || 0,
                    news_count: item.news_count || 0,
                    model_name: 'json-folder-import',
                    status: 'generated',
                    cover_image_url: item.cover_image_url || null,
                    created_at: new Date(item.digest_date).toISOString(),
                }).onConflictDoUpdate({
                    target: dailyDigests.digest_date,
                    set: {
                        content: content,
                        title: title,
                        intro: item.intro,
                        updated_at: new Date().toISOString()
                    }
                });
            }

        } catch (error) {
            console.error(`❌ Error importing ${file}:`, error);
        }
    }

    console.log('🎉 Import completed!');
}

importFolder();
