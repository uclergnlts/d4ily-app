import { getAgendaTopics } from "@/lib/api/agenda"
import { generateAiBriefing } from "@/lib/api/ai-briefing"
import { getCoverageReport } from "@/lib/api/coverage"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

export const maxDuration = 60

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 40, 100)
    const mode = searchParams.get("mode") === "editorial" ? "editorial" : "news"
    const [topics, coverage] = await Promise.all([
      getAgendaTopics(limit, "all"),
      getCoverageReport(),
    ])
    const briefing = await generateAiBriefing({
      topics,
      coverageSummary: coverage.summary,
    })

    const data = mode === "news"
      ? {
          generatedAt: briefing.generatedAt,
          provider: briefing.provider,
          model: briefing.model,
          windowHours: briefing.windowHours,
          headline: briefing.headline,
          lead: briefing.executiveSummary,
          stories: briefing.newsStories,
          watchlist: briefing.watchlist,
          singleSourceAlerts: briefing.singleSourceAlerts,
          coverageNote: briefing.coverageNote,
        }
      : briefing

    return apiSuccess(data, {
      input: {
        topicCount: topics.length,
        activeTwitterAccounts: coverage.summary.activeTwitterAccounts,
        accountsWithTweets24h: coverage.summary.accountsWithTweets24h,
      },
      mode,
      generatedAt: briefing.generatedAt,
    })
  } catch (error) {
    console.error("Failed to generate AI briefing:", error)
    return apiError("Failed to generate AI briefing", 500)
  }
}
