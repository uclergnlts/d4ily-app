import { evaluateAgendaQuality, listQualityEvaluations } from "@/lib/api/observability"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

export const dynamic = "force-dynamic"

type EvaluationBody = {
  expectedItems?: string[]
  expected?: string[]
  date?: string
  save?: boolean
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 25, 100)
    const evaluations = await listQualityEvaluations(limit)

    return apiSuccess(evaluations, {
      count: evaluations.length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to fetch quality evaluations:", error)
    return apiError("Failed to fetch quality evaluations", 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as EvaluationBody
    const expectedItems = body.expectedItems ?? body.expected ?? []

    if (!Array.isArray(expectedItems) || expectedItems.some((item) => typeof item !== "string")) {
      return apiError("expectedItems must be an array of strings", 400)
    }

    const result = await evaluateAgendaQuality(expectedItems, {
      evaluationDate: body.date,
      save: body.save !== false,
    })

    return apiSuccess(result, {
      saved: body.save !== false,
      generatedAt: result.generatedAt,
    })
  } catch (error) {
    console.error("Failed to evaluate agenda quality:", error)
    return apiError("Failed to evaluate agenda quality", 500)
  }
}
