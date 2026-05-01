import { getCoverageReport } from "@/lib/api/coverage"
import { apiError, apiSuccess } from "@/lib/api/response"

export async function GET() {
  try {
    return apiSuccess(await getCoverageReport())
  } catch (error) {
    console.error("Failed to fetch coverage:", error)
    return apiError("Failed to fetch coverage", 500)
  }
}
