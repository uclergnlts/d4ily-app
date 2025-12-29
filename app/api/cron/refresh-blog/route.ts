
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { injectInternalLinks } from "@/lib/services/internal-linker";

export const revalidate = 0;
export const maxDuration = 60; // Allow 1 minute timeout

async function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY missing");
    return new GoogleGenerativeAI(apiKey);
}

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Allow local dev testing
        if (process.env.NODE_ENV === 'production') {
            return new Response("Unauthorized", { status: 401 });
        }
    }

    try {
        // Calculate 90 days ago
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        // Format for SQLite text comparison (ISO string is fine)
        const dateStr = ninetyDaysAgo.toISOString();

        // Finding candidate posts: published AND updated_at < 90 days ago
        // We use sql raw query or simple comparison if Drizzle supports it directly on string dates without sql``
        // Safe way with Drizzle SQLite:
        const oldPosts = await db.run(sql`
            SELECT * FROM blog_posts 
            WHERE published = 1 
            AND updated_at < ${dateStr} 
            LIMIT 1
        `);

        // Drizzle run returns ResultSet, we need rows. 
        // Actually db.select() is better for type safety.

        const posts = await db.select()
            .from(blogPosts)
            .where(sql`${blogPosts.published} = 1 AND ${blogPosts.updated_at} < ${dateStr}`)
            .limit(1);

        if (posts.length === 0) {
            return NextResponse.json({ message: "No stale posts found (older than 90 days)." });
        }

        const post = posts[0];
        console.log(`Refreshing old post: ${post.title}`);

        // AI Update Logic
        const genAI = await getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert editor refreshing an old blog post.
        
        Original Title: "${post.title}"
        Current Top Content: "${post.content.slice(0, 500)}..."
        
        Task: Write ONE new, substantial paragraph (100-150 words) adding a modern perspective, recent statistic, or a "Güncelleme" note relevant to the current date.
        
        Rules:
        1. The paragraph MUST start with bold date: "**Güncelleme (${new Date().toLocaleDateString('tr-TR')}):** "
        2. Do NOT use prohibited phrases like "Günümüzde", "Bu yazıda", "Ele alacağız".
        3. Provide valuable new information or context.
        4. Return ONLY the new paragraph.
        `;

        const result = await model.generateContent(prompt);
        const newParagraph = result.response.text();

        if (!newParagraph) {
            throw new Error("Empty response from AI");
        }

        // Append to content
        let updatedContent = post.content + "\n\n" + newParagraph;

        // Also re-inject internal links
        updatedContent = await injectInternalLinks(updatedContent);

        await db.update(blogPosts)
            .set({
                content: updatedContent,
                updated_at: new Date().toISOString()
            })
            .where(eq(blogPosts.id, post.id));

        return NextResponse.json({
            success: true,
            updated_post: post.title,
            added_content: newParagraph.slice(0, 50) + "..."
        });

    } catch (error: any) {
        console.error("Refresh cron error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
