import { getAgendaTopics } from "@/lib/api/agenda"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

function sortByNewest<T extends { lastUpdatedAt: string | null; firstSeenAt: string | null }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.lastUpdatedAt ?? left.firstSeenAt ?? 0).getTime()
    const rightTime = new Date(right.lastUpdatedAt ?? right.firstSeenAt ?? 0).getTime()
    return rightTime - leftTime
  })
}

const singleSourcePriorityRank = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  none: 1,
}

function sortBySingleSourcePriority<T extends {
  singleSourcePriority: keyof typeof singleSourcePriorityRank
  agendaScore: number
  lastUpdatedAt: string | null
  firstSeenAt: string | null
}>(items: T[]) {
  return [...items].sort((left, right) => {
    const priorityDiff = singleSourcePriorityRank[right.singleSourcePriority] - singleSourcePriorityRank[left.singleSourcePriority]
    if (priorityDiff !== 0) return priorityDiff

    const scoreDiff = right.agendaScore - left.agendaScore
    if (scoreDiff !== 0) return scoreDiff

    const leftTime = new Date(left.lastUpdatedAt ?? left.firstSeenAt ?? 0).getTime()
    const rightTime = new Date(right.lastUpdatedAt ?? right.firstSeenAt ?? 0).getTime()
    return rightTime - leftTime
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 100, 500)
    const topics = await getAgendaTopics(1000, "all")
    const sort = searchParams.get("sort") === "newest" ? "newest" : "priority"
    const pending = topics.filter((topic) => topic.needsConfirmation || topic.signalCount === 1)
    const pendingSignals = sort === "newest" ? sortByNewest(pending) : sortBySingleSourcePriority(pending)
    const items = pendingSignals.slice(0, limit)

    return apiSuccess(items, {
      count: items.length,
      totalMatchingCount: pendingSignals.length,
      singleSignalCount: pendingSignals.filter((item) => item.signalCount === 1).length,
      needsConfirmationCount: pendingSignals.filter((item) => item.needsConfirmation).length,
      criticalSingleSourceCount: pendingSignals.filter((item) => item.singleSourcePriority === "critical").length,
      highSingleSourceCount: pendingSignals.filter((item) => item.singleSourcePriority === "high").length,
      sort,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to fetch pending signals:", error)
    return apiError("Failed to fetch pending signals", 500)
  }
}
