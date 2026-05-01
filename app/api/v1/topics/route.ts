import { apiError, apiSuccess } from "@/lib/api/response"
import { getTopicList } from "@/lib/api/queries"

export async function GET() {
  try {
    const items = await getTopicList()
    return apiSuccess(items, { count: items.length })
  } catch (error) {
    console.error("Failed to fetch topics:", error)
    return apiError("Failed to fetch topics", 500)
  }
}
