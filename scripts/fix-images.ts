
import { sql, like, or, eq, isNull } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function fixImages() {
    console.log('🚀 Starting Image Fixer...');

    // Dynamic import
    const { db } = await import('../lib/db');
    const { dailyDigests } = await import('../lib/db/schema');
    const { fetchGoogleImage } = await import('../lib/image-search');

    // Select digests from migration or folder import, or where cover image is missing
    const digests = await db.select()
        .from(dailyDigests)
        .where(
            or(
                eq(dailyDigests.model_name, 'json-folder-import'),
                eq(dailyDigests.model_name, 'legacy-migration'),
                isNull(dailyDigests.cover_image_url)
            )
        );

    console.log(`Found ${digests.length} digests to check/update.`);

    for (const digest of digests) {
        try {
            // Skip if it already has a "good" image (heuristic: not a simple placeholder if we had one)
            // But user asked to update them, and our migration might have failed to get good images.
            // Let's force update if it's from migration.

            // Use title for search. If title is generic (shouldn't be, we fixed it), fallback to "Türkiye gündemi + date"
            let query = digest.title;
            if (!query || query.includes('Gündem')) {
                query = `Türkiye gündemi haberler ${digest.digest_date}`;
            }

            console.log(`🔍 Searching image for: "${query}" (${digest.digest_date})`);

            const imageUrl = await fetchGoogleImage(query);

            if (imageUrl) {
                console.log(`   📸 Found: ${imageUrl}`);

                await db.update(dailyDigests)
                    .set({ cover_image_url: imageUrl })
                    .where(eq(dailyDigests.id, digest.id));
            } else {
                console.log(`   ❌ No image found.`);
            }

            // Rate limit to be nice to Google
            await new Promise(r => setTimeout(r, 1500));

        } catch (error) {
            console.error(`❌ Error processing ${digest.digest_date}:`, error);
        }
    }

    console.log('🎉 Image optimization completed!');
}

fixImages();
