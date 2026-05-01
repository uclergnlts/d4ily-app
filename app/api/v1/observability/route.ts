import { getObservabilitySummary } from "@/lib/api/observability"
import { apiError, apiSuccess } from "@/lib/api/response"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return apiSuccess(await getObservabilitySummary())
  } catch (error) {
    console.error("Failed to fetch observability summary:", error)
    return apiError("Failed to fetch observability summary", 500)
  }
}
