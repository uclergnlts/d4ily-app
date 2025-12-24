import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { digestReactions } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const digestId = searchParams.get('digestId');
  const visitorId = searchParams.get('visitorId');

  if (!digestId) {
    return NextResponse.json({ error: 'Missing digestId' }, { status: 400 });
  }

  try {
    // Get all reactions for this digest
    const allReactions = await db
      .select()
      .from(digestReactions)
      .where(eq(digestReactions.digest_id, parseInt(digestId)));

    // Count reactions by type
    const helpful = allReactions.filter(r => r.reaction === 'helpful').length;
    const notHelpful = allReactions.filter(r => r.reaction === 'not-helpful').length;

    // Check if this visitor has already reacted
    let userReaction = null;
    if (visitorId) {
      const existingReaction = allReactions.find(
        r => r.visitor_id === visitorId
      );
      userReaction = existingReaction?.reaction || null;
    }

    return NextResponse.json({
      helpful,
      notHelpful,
      userReaction
    });
  } catch (error: any) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { digestId, visitorId, reaction } = body;

    if (!digestId || !visitorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already reacted
    const existing = await db
      .select()
      .from(digestReactions)
      .where(
        and(
          eq(digestReactions.digest_id, digestId),
          eq(digestReactions.visitor_id, visitorId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const currentReaction = existing[0];

      if (currentReaction.reaction === reaction) {
        // Same reaction - remove it (toggle off)
        await db
          .delete(digestReactions)
          .where(eq(digestReactions.id, currentReaction.id));

        return NextResponse.json({ message: 'Reaction removed' });
      } else {
        // Different reaction - update it
        await db
          .update(digestReactions)
          .set({ reaction })
          .where(eq(digestReactions.id, currentReaction.id));

        return NextResponse.json({ message: 'Reaction updated' });
      }
    } else {
      // New reaction - insert it
      await db.insert(digestReactions).values({
        digest_id: digestId,
        visitor_id: visitorId,
        reaction
      });

      return NextResponse.json({ message: 'Reaction added' });
    }
  } catch (error: any) {
    console.error('Error saving reaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
