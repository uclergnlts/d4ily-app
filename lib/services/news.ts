
import { db } from "@/lib/db"
import { processedArticles } from "@/lib/db/schema"
import { desc, eq, notInArray, inArray, and } from "drizzle-orm"

export interface NewsItem {
    id: number
    title: string
    summary: string
    image_url: string | null
    source_name: string
    category: string
    processed_at: string
}

export async function getLatestNews(limit: number = 8) {
    try {
        const articles = await db
            .select({
                id: processedArticles.id,
                title: processedArticles.title,
                summary: processedArticles.summary,
                image_url: processedArticles.image_url,
                source_name: processedArticles.source_name,
                category: processedArticles.category,
                processed_at: processedArticles.processed_at,
            })
            .from(processedArticles)
            .where(
                and(
                    notInArray(processedArticles.category, ['Makale', 'Analiz']),
                    eq(processedArticles.is_published, true)
                )
            )
            .orderBy(desc(processedArticles.processed_at))
            .limit(limit)

        return articles.filter((a: any) => a.title !== "SKIP" && !a.title.includes("SKIP"));
    } catch (error) {
        console.error("Failed to fetch latest news:", error)
        return []
    }
}

export async function getLatestArticles(limit: number = 3) {
    try {
        const articles = await db
            .select({
                id: processedArticles.id,
                title: processedArticles.title,
                summary: processedArticles.summary,
                image_url: processedArticles.image_url,
                source_name: processedArticles.source_name,
                category: processedArticles.category,
                processed_at: processedArticles.processed_at,
            })
            .from(processedArticles)
            .where(
                and(
                    inArray(processedArticles.category, ['Makale', 'Analiz']),
                    eq(processedArticles.is_published, true)
                )
            )
            .orderBy(desc(processedArticles.processed_at))
            .limit(limit)

        return articles.filter((a: any) => a.title !== "SKIP");
    } catch (error) {
        console.error("Failed to fetch editor articles:", error)
        return []
    }
}
