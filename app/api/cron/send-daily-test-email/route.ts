import { NextResponse } from "next/server"

import { sendDailyTestEmail } from "@/lib/api/daily-test-email"
import { checkCronAuth } from "@/lib/cron-auth"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  const unauthorized = checkCronAuth(request)
  if (unauthorized) return unauthorized

  try {
    const result = await sendDailyTestEmail()
    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Failed to send daily test email:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
