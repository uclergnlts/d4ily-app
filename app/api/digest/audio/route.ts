import { db } from "@/lib/db"
import { dailyDigests } from "@/lib/db/schema"
import { desc, isNotNull, and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await db
      .select()
      .from(dailyDigests)
      .orderBy(desc(dailyDigests.digest_date))
      .limit(10)

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "audio not ready" }, { status: 404 })
    }

    // audio_status = 'ready' olanlari filtrele
    const readyDigest = data.find((d: any) => d.audio_status === "ready" && d.audio_url)

    if (!readyDigest) {
      return NextResponse.json({ message: "audio not ready" }, { status: 404 })
    }

    return NextResponse.json({
      id: readyDigest.id,
      audioUrl: readyDigest.audio_url,
      date: readyDigest.digest_date,
      title: readyDigest.title,
      durationSeconds: readyDigest.audio_duration || 300,
    })
  } catch (error) {
    return NextResponse.json({ message: "server error" }, { status: 500 })
  }
}
