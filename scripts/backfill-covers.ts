import * as dotenv from "dotenv"
import { expand } from "dotenv-expand"
import path from "path"

// Load env vars before anything else
const env = dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
expand(env)

// Now we can dynamically import the rest which might depend on env vars
async function main() {
    const { db } = await import("@/lib/db")
    const { dailyDigests } = await import("@/lib/db/schema")
    const { fetchGoogleImage } = await import("@/lib/image-search")
    const { eq } = await import("drizzle-orm")

    console.log("Starting backfill of cover images...")

    const digests = await db.select().from(dailyDigests)

    console.log(`Found ${digests.length} digests to process.`)

    for (const digest of digests) {
        if (digest.cover_image_url) {
            console.log(`Skipping ${digest.digest_date} (already has cover)`)
            continue
        }

        if (!digest.title) {
            console.log(`Skipping ${digest.digest_date} - No title`)
            continue
        }

        console.log(`Processing ${digest.digest_date}: ${digest.title}`)

        try {
            const imageUrl = await fetchGoogleImage(digest.title)

            // Delay to avoid rate limits
            await new Promise(r => setTimeout(r, 1500))

            if (imageUrl) {
                await db.update(dailyDigests)
                    .set({ cover_image_url: imageUrl })
                    .where(eq(dailyDigests.id, digest.id))
                console.log(`Updated ${digest.digest_date} with ${imageUrl}`)
            } else {
                console.log(`No image found for ${digest.digest_date}`)
            }
        } catch (e) {
            console.error(`Failed to process ${digest.digest_date}:`, e)
        }
    }

    console.log("Backfill complete!")
    process.exit(0)
}

main().catch(console.error)
