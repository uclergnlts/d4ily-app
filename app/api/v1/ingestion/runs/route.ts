import { listIngestionRuns } from "@/lib/api/observability"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 25, 100)
    const runType = searchParams.get("runType")
    const runs = await listIngestionRuns(limit, runType)

    return apiSuccess(runs, {
      count: runs.length,
      runType,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to fetch ingestion runs:", error)
    return apiError("Failed to fetch ingestion runs", 500)
  }
}
