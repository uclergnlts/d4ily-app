import Parser from "rss-parser";

const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'media:content', { keepArray: true }],
            ['enclosure', 'enclosure'],
            ['image', 'image'],
            ['itunes:image', 'itunes:image'],
            ['content:encoded', 'content:encoded']
        ]
    }
});

export interface RssItem {
    title?: string;
    link?: string;
    pubDate?: string;
    content?: string;
    contentSnippet?: string;
    guid?: string;
    isoDate?: string;
    [key: string]: any;
}

export async function fetchRssFeed(url: string): Promise<{ title?: string; items: RssItem[] }> {
    try {
        const feed = await parser.parseURL(url);
        return {
            title: feed.title,
            items: feed.items,
        };
    } catch (error: any) {
        console.error(`Error fetching RSS feed ${url}:`, error.message);
        return { items: [] };
    }
}
