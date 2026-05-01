import { apiError, apiSuccess } from "@/lib/api/response"
import { getPublishedDigestByDate } from "@/lib/api/queries"
import { isValidDateParam } from "@/lib/api/validators"

export async function GET(_: Request, { params }: { params: Promise<{ date: string }> }) {
  try {
    const { date } = await params

    if (!isValidDateParam(date)) {
      return apiError("Invalid date format. Use YYYY-MM-DD", 400)
    }

    const digest = await getPublishedDigestByDate(date)

    if (!digest) {
      return apiError("Digest not found", 404)
    }

    return apiSuccess(digest)
  } catch (error) {
    console.error("Failed to fetch digest by date:", error)
    return apiError("Failed to fetch digest", 500)
  }
}
