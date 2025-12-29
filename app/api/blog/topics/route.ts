import { db } from "@/lib/db";
import { topics } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const allTopics = await db.select()
            .from(topics)
            .orderBy(desc(topics.created_at));

        return NextResponse.json(allTopics);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.slug) {
            return NextResponse.json(
                { error: "Name and slug are required" },
                { status: 400 }
            );
        }

        const newTopic = await db.insert(topics).values({
            name: body.name,
            slug: body.slug,
            description: body.description,
            parent_id: body.parent_id,
        }).returning();

        return NextResponse.json(newTopic[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
