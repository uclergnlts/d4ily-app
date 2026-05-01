import { getAgendaTopics } from "@/lib/api/agenda"
import { generateAiBriefing } from "@/lib/api/ai-briefing"
import { getCoverageReport } from "@/lib/api/coverage"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

export const maxDuration = 60

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

function sortSingleSourceAlerts<T extends {
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
    const topicLimit = parseLimit(searchParams.get("topicLimit"), 40, 100)
    const latestLimit = parseLimit(searchParams.get("latestLimit"), 30, 100)
    const developingLimit = parseLimit(searchParams.get("developingLimit"), 20, 60)
    const pendingLimit = parseLimit(searchParams.get("pendingLimit"), 20, 60)

    const [briefingTopics, allTopics, coverage] = await Promise.all([
      getAgendaTopics(topicLimit, "all"),
      getAgendaTopics(1000, "all"),
      getCoverageReport(),
    ])
    const briefing = await generateAiBriefing({
      topics: briefingTopics,
      coverageSummary: coverage.summary,
    })

    const latestSignals = sortByNewest(allTopics).slice(0, latestLimit)
    const developingStories = allTopics
      .filter((topic) => topic.confidenceLevel !== "high" || topic.needsConfirmation)
      .slice(0, developingLimit)
    const singleSourceAlerts = sortSingleSourceAlerts(
      allTopics.filter((topic) => topic.signalCount === 1 || topic.needsConfirmation),
    ).slice(0, pendingLimit)

    return apiSuccess({
      generatedAt: briefing.generatedAt,
      windowHours: 24,
      provider: briefing.provider,
      model: briefing.model,
      headline: briefing.headline,
      lead: briefing.executiveSummary,
      topStories: briefing.newsStories,
      latestSignals,
      developingStories,
      singleSourceAlerts: briefing.singleSourceAlerts.length > 0
        ? briefing.singleSourceAlerts
        : singleSourceAlerts.map((topic) => ({
            title: topic.title,
            source: topic.representativeSignals[0]?.sourceName ?? null,
            signalType: topic.signalType,
            confidenceLevel: topic.confidenceLevel,
            singleSourcePriority: topic.singleSourcePriority,
            whyWatch: topic.singleSourceReason ?? (
              topic.needsConfirmation
                ? "Teyit bekleyen sinyal."
                : "Tek kaynaklı olduğu için görünür tutuluyor."
            ),
          })),
      watchlist: briefing.watchlist,
      coverage: {
        summary: coverage.summary,
        attention: coverage.attention,
      },
      counts: {
        totalTopics: allTopics.length,
        aiInputTopics: briefingTopics.length,
        topStories: briefing.newsStories.length,
        latestSignals: latestSignals.length,
        developingStories: developingStories.length,
        singleSourceAlerts: singleSourceAlerts.length,
        needsConfirmation: allTopics.filter((topic) => topic.needsConfirmation).length,
        singleSignal: allTopics.filter((topic) => topic.signalCount === 1).length,
        criticalSingleSource: allTopics.filter((topic) => topic.singleSourcePriority === "critical").length,
        highSingleSource: allTopics.filter((topic) => topic.singleSourcePriority === "high").length,
        lead: allTopics.filter((topic) => topic.agendaTier === "lead").length,
        major: allTopics.filter((topic) => topic.agendaTier === "major").length,
        watch: allTopics.filter((topic) => topic.agendaTier === "watch").length,
        routine: allTopics.filter((topic) => topic.agendaTier === "routine").length,
      },
    }, {
      input: {
        topicLimit,
        latestLimit,
        developingLimit,
        pendingLimit,
      },
      generatedAt: briefing.generatedAt,
    })
  } catch (error) {
    console.error("Failed to build feed:", error)
    return apiError("Failed to build feed", 500)
  }
}
