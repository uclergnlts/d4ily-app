import { getAgendaTopics } from "@/lib/api/agenda"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

function parseBoolean(value: string | null) {
  if (value === "true") return true
  if (value === "false") return false
  return null
}

function sortByNewest<T extends { lastUpdatedAt: string | null; firstSeenAt: string | null }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.lastUpdatedAt ?? left.firstSeenAt ?? 0).getTime()
    const rightTime = new Date(right.lastUpdatedAt ?? right.firstSeenAt ?? 0).getTime()
    return rightTime - leftTime
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 500, 1000)
    const signalType = searchParams.get("signalType")
    const confidenceLevel = searchParams.get("confidenceLevel")
    const singleSourcePriority = searchParams.get("singleSourcePriority")
    const needsConfirmation = parseBoolean(searchParams.get("needsConfirmation"))
    const isRoutine = parseBoolean(searchParams.get("isRoutine"))
    const singleSource = parseBoolean(searchParams.get("singleSource"))
    const sort = searchParams.get("sort") === "newest" ? "newest" : "score"
    const allItems = await getAgendaTopics(1000, "all")
    const filteredItems = allItems.filter((item) => {
      if (signalType && item.signalType !== signalType) return false
      if (confidenceLevel && item.confidenceLevel !== confidenceLevel) return false
      if (singleSourcePriority && item.singleSourcePriority !== singleSourcePriority) return false
      if (needsConfirmation !== null && item.needsConfirmation !== needsConfirmation) return false
      if (isRoutine !== null && item.isRoutine !== isRoutine) return false
      if (singleSource !== null && (item.signalCount === 1) !== singleSource) return false
      return true
    })
    const items = (sort === "newest" ? sortByNewest(filteredItems) : filteredItems).slice(0, limit)

    return apiSuccess(items, {
      count: items.length,
      totalMatchingCount: filteredItems.length,
      singleSignalCount: filteredItems.filter((item) => item.signalCount === 1).length,
      needsConfirmationCount: filteredItems.filter((item) => item.needsConfirmation).length,
      criticalSingleSourceCount: filteredItems.filter((item) => item.singleSourcePriority === "critical").length,
      highSingleSourceCount: filteredItems.filter((item) => item.singleSourcePriority === "high").length,
      filters: {
        signalType,
        confidenceLevel,
        singleSourcePriority,
        needsConfirmation,
        isRoutine,
        singleSource,
        sort,
      },
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to fetch signals:", error)
    return apiError("Failed to fetch signals", 500)
  }
}
