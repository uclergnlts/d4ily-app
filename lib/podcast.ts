import Parser from "rss-parser"

export interface PodcastEpisode {
    title: string
    link: string
    pubDate: string
    content: string
    contentSnippet: string
    guid: string
    imageUrl?: string
}

export async function getLatestPodcastEpisode(): Promise<PodcastEpisode | null> {
    const parser = new Parser()
    try {
        const feed = await parser.parseURL("https://anchor.fm/s/10cceac40/podcast/rss")

        if (feed.items && feed.items.length > 0) {
            const item = feed.items[0]
            return {
                title: item.title || "",
                link: item.link || "",
                pubDate: item.pubDate || "",
                content: item.content || "",
                contentSnippet: item.contentSnippet || "",
                guid: item.guid || "",
                imageUrl: feed.image?.url || undefined // Feed image is usually consistent
            }
        }
        return null
    } catch (error) {
        console.error("Error fetching podcast feed:", error)
        return null
    }
}
