import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"
import { getPublishedArticles } from "@/lib/api/queries"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 20, 100)
    const items = await getPublishedArticles(limit)

    return apiSuccess(items, { count: items.length })
  } catch (error) {
    console.error("Failed to fetch published articles:", error)
    return apiError("Failed to fetch published articles", 500)
  }
}
