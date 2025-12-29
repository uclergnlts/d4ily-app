import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Injects internal links into a markdown text.
 * It finds keywords that match blog post titles or tags and links them.
 */
export async function injectInternalLinks(content: string): Promise<string> {
    // 1. Fetch all published blog posts (cache this in production!)
    const posts = await db.select({
        title: blogPosts.title,
        slug: blogPosts.slug,
        keywords: blogPosts.tags // Assuming tags are keywords we want to link
    })
        .from(blogPosts)
        .where(eq(blogPosts.published, true));

    if (posts.length === 0) return content;

    let processedContent = content;
    const linkMap = new Map<string, string>(); // keyword -> url

    // 2. Build a map of keywords to URLs
    for (const post of posts) {
        // Link the full title
        if (post.title.length < 50) { // Avoid linking very long titles
            linkMap.set(post.title.toLowerCase(), `/blog/${post.slug}`);
        }

        // Link tags/keywords
        try {
            if (post.keywords) {
                const tags = JSON.parse(post.keywords as string);
                if (Array.isArray(tags)) {
                    for (const tag of tags) {
                        if (tag.length > 4) { // Avoid short words like "AI", "tr"
                            linkMap.set(tag.toLowerCase(), `/blog/${post.slug}`);
                        }
                    }
                }
            }
        } catch (e) {
            // ignore JSON parse error
        }
    }

    // 3. Replace keywords in content
    // Sort keywords by length descending to match longest first (e.g. "Artificial Intelligence" before "Intelligence")
    const keywords = Array.from(linkMap.keys()).sort((a, b) => b.length - a.length);

    // We need to be careful not to replace text inside existing links [text](url) or HTML tags.
    // A simple approach: split by existing links and process only the text parts.

    // Regex to match markdown links: \[([^\]]+)\]\(([^)]+)\)
    const parts = processedContent.split(/(\[[^\]]+\]\([^)]+\))/g);

    const finalParts = parts.map(part => {
        // If it starts with [, it's likely a link we split, so return as is.
        if (part.startsWith("[")) return part;

        let textPart = part;

        // Try to link ONE instance of each keyword in this text block
        // (Actually, maybe just one instance per doc is better, but per block is easier here)
        // Let's just do simple replacement for now.

        for (const keyword of keywords) {
            // Simple check if keyword exists
            const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');
            const match = textPart.match(regex);

            if (match) {
                const url = linkMap.get(keyword);
                // Replace ONLY the first occurrence to avoid over-linking
                // And ensure we preserve the original casing of the matched text
                textPart = textPart.replace(regex, `[${match[0]}](${url})`);
            }
        }
        return textPart;
    });

    return finalParts.join("");
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
