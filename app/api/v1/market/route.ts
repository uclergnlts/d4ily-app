import { apiError, apiSuccess } from "@/lib/api/response"
import { getMarketSnapshot } from "@/lib/api/queries"

export const revalidate = 300

export async function GET() {
  try {
    const snapshot = await getMarketSnapshot()
    return apiSuccess(snapshot)
  } catch (error) {
    console.error("Failed to fetch market snapshot:", error)
    return apiError("Failed to fetch market snapshot", 500)
  }
}
