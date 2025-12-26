import axios from 'axios';
import * as cheerio from 'cheerio';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BASE_URL = 'https://d4ily.com';
const ARCHIVE_URL = `${BASE_URL}/arsiv`;

async function migrateArchive() {
    console.log('🚀 Starting archive migration...');

    // Dynamic import to ensure env vars are loaded
    const { db } = await import('../lib/db');
    const { dailyDigests } = await import('../lib/db/schema');

    try {
        // 1. Fetch Archive Page
        console.log(`📡 Fetching archive list from ${ARCHIVE_URL}...`);
        const { data: archiveHtml } = await axios.get(ARCHIVE_URL);
        const $ = cheerio.load(archiveHtml);

        // 2. Extract Links
        const digestLinks: string[] = [];
        $('a.group.block').each((_, element) => {
            const href = $(element).attr('href');
            if (href && href.match(/\/\d{4}-\d{2}-\d{2}/)) {
                digestLinks.push(href);
            }
        });

        console.log(`Found ${digestLinks.length} digests to migrate.`);

        // 3. Process Each Digest
        for (const link of digestLinks) {
            const fullUrl = `${BASE_URL}${link}`;
            const dateStr = link.split('/').pop(); // "2024-12-24"

            if (!dateStr) continue;

            // Check if exists
            const existing = await db.select().from(dailyDigests).where(sql`digest_date = ${dateStr}`).get();
            if (existing) {
                console.log(`⏩ Skipping ${dateStr} (already exists)`);
                continue;
            }

            console.log(`📥 Migrating ${dateStr}...`);

            try {
                // Fetch Detail Page
                const { data: detailHtml } = await axios.get(fullUrl);
                const $$ = cheerio.load(detailHtml);

                // Extract Data
                const title = $$('h1').first().text().trim() || `Türkiye Gündemi - ${dateStr}`;

                // Content extraction is tricky, let's grab the main container text
                // Adjust selector based on inspection: main .max-w-4xl
                let content = '';
                $$('main .max-w-4xl').children().each((_, el) => {
                    // Exclude headers if needed, or keep structure
                    // Simple text extraction for now, or keep HTML if needed?
                    // Let's try to keep meaningful text structure
                    const tagName = $$(el).prop('tagName');
                    const text = $$(el).text().trim();
                    if (text) {
                        if (tagName === 'H2') content += `\n## ${text}\n\n`;
                        else if (tagName === 'P') content += `${text}\n\n`;
                        else if (tagName === 'UL') {
                            $$(el).find('li').each((_, li) => {
                                content += `- ${$$(li).text().trim()}\n`;
                            });
                            content += '\n';
                        }
                    }
                });

                // Clean content
                content = content.replace(/Sosyal Paylaşım Kartı Oluştur[\s\S]*/, ''); // Remove UI elements text

                // Intro (First paragraph)
                const intro = $$('main .max-w-4xl p').first().text().trim().substring(0, 300);

                // Image
                let coverImage = $$('img[src*="podcast"]').attr('src') || $$('img[src*="images.unsplash.com"]').attr('src');

                // Save to DB
                await db.insert(dailyDigests).values({
                    digest_date: dateStr,
                    title,
                    intro,
                    content,
                    tweets_count: 0, // Unknown
                    news_count: 0, // Unknown
                    model_name: 'legacy-migration',
                    status: 'generated',
                    cover_image_url: coverImage,
                    created_at: new Date(dateStr).toISOString(),
                });

                console.log(`✅ Imported ${dateStr}`);

                // Rate limit
                await new Promise(r => setTimeout(r, 500));

            } catch (err) {
                console.error(`❌ Failed to migrate ${dateStr}:`, err);
            }
        }

        console.log('🎉 Migration completed!');

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateArchive();
