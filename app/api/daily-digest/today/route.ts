import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { dailyDigests } from "@/lib/db/schema"
import { desc, eq, and, lte } from "drizzle-orm"
import { getTodayInIstanbul, transformDigestResponse } from "@/lib/api-helpers"

export async function GET() {
  try {
    const today = getTodayInIstanbul()

    // First try: find today's published digest
    const todayDigests = await db
      .select()
      .from(dailyDigests)
      .where(and(eq(dailyDigests.digest_date, today), eq(dailyDigests.published, true)))
      .orderBy(desc(dailyDigests.created_at))
      .limit(1)

    if (todayDigests && todayDigests.length > 0) {
      return NextResponse.json(transformDigestResponse(todayDigests[0]))
    }

    // Fallback: find most recent published digest where date <= today
    const fallbackDigests = await db
      .select()
      .from(dailyDigests)
      .where(and(lte(dailyDigests.digest_date, today), eq(dailyDigests.published, true)))
      .orderBy(desc(dailyDigests.digest_date))
      .limit(1)

    if (fallbackDigests && fallbackDigests.length > 0) {
      return NextResponse.json(transformDigestResponse(fallbackDigests[0]))
    }

    // No published digest found
    return NextResponse.json({ error: "No published digest found" }, { status: 404 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
