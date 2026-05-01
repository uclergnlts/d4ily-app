import { buildDailyTestEmail } from "@/lib/api/daily-test-email"
import { apiError, apiSuccess } from "@/lib/api/response"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const email = await buildDailyTestEmail()
    return apiSuccess(email, {
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to build daily test email preview:", error)
    return apiError("Failed to build daily test email preview", 500)
  }
}
