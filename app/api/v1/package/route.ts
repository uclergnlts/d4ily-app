import { getAgendaTopics } from "@/lib/api/agenda"
import { getCoverageReport } from "@/lib/api/coverage"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

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
    const firehoseLimit = parseLimit(searchParams.get("firehoseLimit"), 200, 1000)
    const featuredLimit = parseLimit(searchParams.get("featuredLimit"), 30, 100)
    const pendingLimit = parseLimit(searchParams.get("pendingLimit"), 100, 500)
    const [allSignals, featuredAgenda, coverage] = await Promise.all([
      getAgendaTopics(1000, "all"),
      getAgendaTopics(featuredLimit, "featured"),
      getCoverageReport(),
    ])
    const pendingConfirmation = sortByNewest(
      allSignals.filter((item) => item.needsConfirmation || item.signalCount === 1),
    ).slice(0, pendingLimit)
    const firehose = sortByNewest(allSignals).slice(0, firehoseLimit)

    return apiSuccess({
      generatedAt: new Date().toISOString(),
      windowHours: 24,
      coverage: {
        summary: coverage.summary,
        attention: coverage.attention,
      },
      counts: {
        totalSignals: allSignals.length,
        firehose: firehose.length,
        featuredAgenda: featuredAgenda.length,
        pendingConfirmation: pendingConfirmation.length,
        singleSignal: allSignals.filter((item) => item.signalCount === 1).length,
        needsConfirmation: allSignals.filter((item) => item.needsConfirmation).length,
      },
      firehose,
      featuredAgenda,
      pendingConfirmation,
    })
  } catch (error) {
    console.error("Failed to build API package:", error)
    return apiError("Failed to build API package", 500)
  }
}
