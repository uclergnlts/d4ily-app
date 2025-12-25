import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyDigests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

// GET - Fetch digest by ID for editing
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Digest ID required' }, { status: 400 });
        }

        const digest = await db.select()
            .from(dailyDigests)
            .where(eq(dailyDigests.id, parseInt(id)))
            .limit(1);

        if (!digest || digest.length === 0) {
            return NextResponse.json({ success: false, error: 'Digest not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, digest: digest[0] });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT - Update digest
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, intro, content, cover_image_url, category, greeting_text, published } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'Digest ID required' }, { status: 400 });
        }

        // Build update object with only provided fields
        const updateData: any = {
            updated_at: new Date().toISOString(),
        };

        if (title !== undefined) updateData.title = title;
        if (intro !== undefined) updateData.intro = intro;
        if (content !== undefined) updateData.content = content;
        if (cover_image_url !== undefined) updateData.cover_image_url = cover_image_url;
        if (category !== undefined) updateData.category = category;
        if (greeting_text !== undefined) updateData.greeting_text = greeting_text;
        if (published !== undefined) updateData.published = published;

        // Update word count if content changed
        if (content !== undefined) {
            updateData.word_count = content.split(/\s+/).length;
        }

        const result = await db.update(dailyDigests)
            .set(updateData)
            .where(eq(dailyDigests.id, parseInt(id)))
            .returning();

        if (!result || result.length === 0) {
            return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, digest: result[0] });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
