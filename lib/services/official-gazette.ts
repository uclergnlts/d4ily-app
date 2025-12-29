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

    // 2. If not found, scrape and generate
    try {
        const url = 'https://www.resmigazete.gov.tr/'
        const response = await fetch(url)
        if (!response.ok) return null

        const html = await response.text()
        const $ = cheerio.load(html)

        // Validating it's today's gazette
        // The title often contains the date, e.g., "... 25 Aralık 2025 PERŞEMBE ..."
        // We can just grab the main content titles.

        // Main content container usually has ID 'content' or class 'main-content'
        // Let's grab specific headers like 'YÖNETMELİKLER', 'TEBLİĞLER', 'KARARLAR'

        let rawContent = ""

        // Iterate through headers to extract relevant text
        $('.html-title').each((_, el) => {
            const title = $(el).text().trim()
            rawContent += `\n# ${title}\n`

            // Get siblings until next title? 
            // The structure is usually Title -> List of links/texts
            // This scraping logic needs to be robust. 
            // For now, let's grab the text of the main listing area.
        })

        // Use .gunluk-akis as it contains the main flow of decisions
        const mainText = $('.gunluk-akis').text().replace(/\s+/g, ' ').trim().slice(0, 10000)

        if (!mainText || mainText.length < 50) return null

        // 3. Generate Summary with AI
        const prompt = `
        Aşağıda bugünkü T.C. Resmi Gazete'nin içerik metni yer almaktadır.
        Lütfen bu içeriği analiz et ve halkı/vatandaşı en çok ilgilendiren, en kritik 3 değişikliği veya kararı madde madde özetle.
        
        Özeti şu formatta ver (Markdown):
        - **[Konu Başlığı]**: [Kısa Açıklama]
        - **[Konu Başlığı]**: [Kısa Açıklama]
        - **[Konu Başlığı]**: [Kısa Açıklama]
        
        Sadece bu 3 maddeyi ver, başka bir şey ekleme.
        
        İÇERİK:
        ${mainText}
        `

        const summary = await generateWithGemini(prompt) || "Özet oluşturulamadı."

        // 4. Save to DB (Upsert)
        try {
            await db.insert(officialGazetteSummaries).values({
                date: today,
                summary_markdown: summary,
                gazette_url: url
            }).onConflictDoUpdate({
                target: officialGazetteSummaries.date,
                set: {
                    summary_markdown: summary,
                    gazette_url: url,
                    created_at: sql`CURRENT_TIMESTAMP`
                }
            })
        } catch (saveError) {
            console.warn("Failed to save Gazette summary to DB (ignoring for build):", saveError)
        }

        return {
            date: today,
            summary_markdown: summary,
            gazette_url: url
        }

    } catch (error) {
        console.error("Official Gazette processing failed:", error)
        return null
    }
}
