import { db } from "@/lib/db"
import { dailyDigests } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

function getIstanbulDate(): string {
  const now = new Date()
  const istanbulOffset = 3 * 60
  const utcOffset = now.getTimezoneOffset()
  const istanbulTime = new Date(now.getTime() + (istanbulOffset + utcOffset) * 60 * 1000)
  return istanbulTime.toISOString().split("T")[0]
}

export async function GET() {
  try {
    const today = getIstanbulDate()

    let data = await db
      .select()
      .from(dailyDigests)
      .where(eq(dailyDigests.digest_date, today))
      .limit(1)

    // Bugun yoksa en son digest'i getir
    if (!data || data.length === 0) {
      data = await db
        .select()
        .from(dailyDigests)
        .orderBy(desc(dailyDigests.digest_date))
        .limit(1)
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "no digest for today" }, { status: 404 })
    }

    const digest = data[0]

    return NextResponse.json({
      id: digest.id,
      content: digest.content,
      title: digest.title,
      date: digest.digest_date,
      audioUrl: digest.audio_url || null,
      audioStatus: digest.audio_status || "pending",
    })
  } catch (error) {
    return NextResponse.json({ message: "server error" }, { status: 500 })
  }
}
