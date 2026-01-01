import { db } from "@/lib/db"
import { officialGazetteSummaries } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { generateWithGemini } from "@/lib/ai"
import * as cheerio from 'cheerio'

export interface GazetteSummary {
    date: string
    summary_markdown: string
    gazette_url: string
}

export async function getOfficialGazetteSummary(): Promise<GazetteSummary | null> {
    const today = new Date().toISOString().split('T')[0]

    // 1. Check DB (Wrapped in try-catch for CI/Build robustness)
    try {
        const existing = await db.select().from(officialGazetteSummaries).where(eq(officialGazetteSummaries.date, today)).get()

        if (existing) {
            return {
                date: existing.date,
                summary_markdown: existing.summary_markdown,
                gazette_url: existing.gazette_url
            }
        }
    } catch (dbError) {
        console.warn("Gazette DB check failed (likely CI or missing table):", dbError)
        // Continue to scrape or return null if strict
        // In CI build, we likely want to just continue or return null to avoid breaking build works
        // If this fails, scraping likely works but saving will fail too.
        // For now, let's proceed to try scraping, but saving might also fail.
    }

    // 2. If not found in DB, DO NOT scrape and generate on the fly during page load.
    // This causes massive performance issues (5-10s delay).
    // Instead, return null and let the Cron Job handle the population.

    // Check if we can just scrape the simple titles without AI?
    // Maybe, but even scraping is risky. Let's rely on DB or return null.
    // If the data is critical, the Cron Job must act.

    return null

    /* 
    Legacy Code: Removed for performance. 
    Generation moved to: /api/cron/auto-blog-from-agenda (conceptually)
    
    try {
        const url = 'https://www.resmigazete.gov.tr/'
        // ... scraping ...
        // ... AI generation ...
        // ... DB insert ...
    } catch (error) { ... }
    */
}
