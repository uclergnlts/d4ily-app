import { apiError, apiSuccess } from "@/lib/api/response"
import { getTodayOrLatestPublishedDigest } from "@/lib/api/queries"

export async function GET() {
  try {
    const digest = await getTodayOrLatestPublishedDigest()

    if (!digest) {
      return apiError("No published digest found", 404)
    }

    return apiSuccess(digest)
  } catch (error) {
    console.error("Failed to fetch current digest:", error)
    return apiError("Failed to fetch current digest", 500)
  }
}
