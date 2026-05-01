import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"
import { getAgendaTopics } from "@/lib/api/agenda"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 100, 500)
    const mode = searchParams.get("mode") === "featured" ? "featured" : "all"
    const items = await getAgendaTopics(limit, mode)

    return apiSuccess(items, {
      count: items.length,
      mode,
      singleSignalCount: items.filter((item) => item.signalCount === 1).length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to fetch agenda topics:", error)
    return apiError("Failed to fetch agenda topics", 500)
  }
}
