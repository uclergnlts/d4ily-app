import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const page = parseInt(searchParams.get("page") || "1");
        const offset = (page - 1) * limit;

        const posts = await db.select()
            .from(blogPosts)
            .orderBy(desc(blogPosts.created_at))
            .limit(limit)
            .offset(offset);

        return NextResponse.json(posts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.content || !body.slug) {
            return NextResponse.json(
                { error: "Title, content and slug are required" },
                { status: 400 }
            );
        }

        const newPost = await db.insert(blogPosts).values({
            title: body.title,
            slug: body.slug,
            content: body.content,
            excerpt: body.excerpt,
            cover_image_url: body.cover_image_url,
            published: body.published || false,
            topic_id: body.topic_id,
        }).returning();

        return NextResponse.json(newPost[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
