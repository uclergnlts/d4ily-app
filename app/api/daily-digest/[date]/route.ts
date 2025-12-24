import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { dailyDigests } from "@/lib/db/schema"
import { desc, eq, and } from "drizzle-orm"
import { transformDigestResponse } from "@/lib/api-helpers"

function isValidDate(date: string): boolean {
  if (!date || date.length !== 10) return false
  const parts = date.split("-")
  if (parts.length !== 3) return false
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false
  if (year < 2020 || year > 2100) return false
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  return true
}

export async function GET(request: Request, { params }: { params: Promise<{ date: string }> }) {
  try {
    const { date } = await params

    if (!isValidDate(date)) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 })
    }

    const digests = await db
      .select()
      .from(dailyDigests)
      .where(and(eq(dailyDigests.digest_date, date), eq(dailyDigests.published, true)))
      .orderBy(desc(dailyDigests.created_at))
      .limit(1)

    if (digests && digests.length > 0) {
      return NextResponse.json(transformDigestResponse(digests[0]))
    }

    return NextResponse.json({ error: "Digest not found for given date" }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
