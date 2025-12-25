import { db } from "@/lib/db"
import { officialGazetteSummaries } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { generateWithGemini } from "@/lib/ai"
import * as cheerio from 'cheerio'

export interface GazetteSummary {
    date: string
    summary_markdown: string
    gazette_url: string
}

export async function getOfficialGazetteSummary(): Promise<GazetteSummary | null> {
    const today = new Date().toISOString().split('T')[0]

    // 1. Check DB
    const existing = await db.select().from(officialGazetteSummaries).where(eq(officialGazetteSummaries.date, today)).get()

    if (existing) {
        return {
            date: existing.date,
            summary_markdown: existing.summary_markdown,
            gazette_url: existing.gazette_url
        }
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

        // Simpler approach: Get the text of the main content column
        // Selector might need adjustment
        const mainText = $('#mevzuat').text().replace(/\s+/g, ' ').trim().slice(0, 10000) // Accessing main mevzuat list

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

        // 4. Save to DB
        await db.insert(officialGazetteSummaries).values({
            date: today,
            summary_markdown: summary,
            gazette_url: url
        })

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
