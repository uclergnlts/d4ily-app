import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { twitterAccounts } from "@/lib/db/schema";
import { eq, like, or } from "drizzle-orm";

export const dynamic = 'force-dynamic';

// GET - List Twitter accounts
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const active = searchParams.get('active');
        const search = searchParams.get('search');

        let query = db.select().from(twitterAccounts);

        // Apply filters
        const conditions = [];
        if (category) {
            conditions.push(eq(twitterAccounts.category, category));
        }
        if (active !== null && active !== undefined) {
            conditions.push(eq(twitterAccounts.is_active, active === 'true'));
        }
        if (search) {
            conditions.push(
                or(
                    like(twitterAccounts.username, `%${search}%`),
                    like(twitterAccounts.display_name, `%${search}%`)
                )
            );
        }

        const accounts = await query.$dynamic();

        return NextResponse.json({
            success: true,
            accounts,
            total: accounts.length
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST - Add new Twitter account
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, display_name, category, priority, notes, show_in_live_feed } = body;

        if (!username) {
            return NextResponse.json({ success: false, error: 'Username required' }, { status: 400 });
        }

        const result = await db.insert(twitterAccounts).values({
            username,
            display_name,
            category: category || "genel",
            priority: priority || 5,
            notes,
            show_in_live_feed: show_in_live_feed !== undefined ? show_in_live_feed : false,
            is_active: true,
        }).returning();

        return NextResponse.json({ success: true, account: result[0] });

    } catch (error: any) {
        if (error.message.includes('UNIQUE')) {
            return NextResponse.json({ success: false, error: 'Username already exists' }, { status: 409 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT - Update Twitter account
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, username, display_name, category, priority, is_active, notes, show_in_live_feed } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
        }

        const updateData: any = {
            updated_at: new Date().toISOString(),
        };

        if (username !== undefined) updateData.username = username;
        if (display_name !== undefined) updateData.display_name = display_name;
        if (category !== undefined) updateData.category = category;
        if (priority !== undefined) updateData.priority = priority;
        if (is_active !== undefined) updateData.is_active = is_active;
        if (notes !== undefined) updateData.notes = notes;
        if (show_in_live_feed !== undefined) updateData.show_in_live_feed = show_in_live_feed;

        const result = await db.update(twitterAccounts)
            .set(updateData)
            .where(eq(twitterAccounts.id, parseInt(id)))
            .returning();

        if (!result || result.length === 0) {
            return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, account: result[0] });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE - Delete Twitter account
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
        }

        await db.delete(twitterAccounts).where(eq(twitterAccounts.id, parseInt(id)));

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
