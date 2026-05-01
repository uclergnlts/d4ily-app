import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"
import { getTweetFeed } from "@/lib/api/queries"
import { parseCursor } from "@/lib/api/validators"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 20, 50)
    const cursor = parseCursor(searchParams.get("cursor"))
    const result = await getTweetFeed(limit, cursor)

    return apiSuccess(result.items, {
      count: result.items.length,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
    })
  } catch (error) {
    console.error("Failed to fetch tweets:", error)
    return apiError("Failed to fetch tweets", 500)
  }
}
