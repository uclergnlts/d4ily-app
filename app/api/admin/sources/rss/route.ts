import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rssSources } from "@/lib/db/schema";
import { eq, like } from "drizzle-orm";

export const dynamic = 'force-dynamic';

// GET - List RSS sources
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const active = searchParams.get('active');

        let query = db.select().from(rssSources);

        const conditions = [];
        if (category) {
            conditions.push(eq(rssSources.category, category));
        }
        if (active !== null && active !== undefined) {
            conditions.push(eq(rssSources.is_active, active === 'true'));
        }

        const sources = await query.$dynamic();

        return NextResponse.json({
            success: true,
            sources,
            total: sources.length
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Add new RSS source
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, name, category, fetch_interval, notes } = body;

        if (!url || !name) {
            return NextResponse.json({ success: false, error: 'URL and name required' }, { status: 400 });
        }

        const result = await db.insert(rssSources).values({
            url,
            name,
            category: category || "gundem",
            fetch_interval: fetch_interval || 240,
            notes,
            is_active: true,
        }).returning();

        return NextResponse.json({ success: true, source: result[0] });

    } catch (error: any) {
        if (error.message.includes('UNIQUE')) {
            return NextResponse.json({ success: false, error: 'URL already exists' }, { status: 409 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT - Update RSS source
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, url, name, category, fetch_interval, is_active, notes } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
        }

        const updateData: any = {
            updated_at: new Date().toISOString(),
        };

        if (url !== undefined) updateData.url = url;
        if (name !== undefined) updateData.name = name;
        if (category !== undefined) updateData.category = category;
        if (fetch_interval !== undefined) updateData.fetch_interval = fetch_interval;
        if (is_active !== undefined) updateData.is_active = is_active;
        if (notes !== undefined) updateData.notes = notes;

        const result = await db.update(rssSources)
            .set(updateData)
            .where(eq(rssSources.id, parseInt(id)))
            .returning();

        if (!result || result.length === 0) {
            return NextResponse.json({ success: false, error: 'Source not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, source: result[0] });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE - Delete RSS source
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
        }

        await db.delete(rssSources).where(eq(rssSources.id, parseInt(id)));

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
