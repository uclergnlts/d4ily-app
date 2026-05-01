import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"
import { getPublishedEditorialFeed, getPublishedNewsFeed } from "@/lib/api/queries"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 20, 100)
    const type = searchParams.get("type") ?? "news"

    if (type === "editorial") {
      const items = await getPublishedEditorialFeed(limit)
      return apiSuccess(items, { count: items.length, type })
    }

    if (type !== "news") {
      return apiError("Invalid type. Use 'news' or 'editorial'", 400)
    }

    const items = await getPublishedNewsFeed(limit)
    return apiSuccess(items, { count: items.length, type })
  } catch (error) {
    console.error("Failed to fetch news feed:", error)
    return apiError("Failed to fetch news feed", 500)
  }
}
