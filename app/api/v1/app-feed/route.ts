import { getCachedAppFeed } from "@/lib/api/app-feed"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

export const maxDuration = 60

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const topicLimit = parseLimit(searchParams.get("topicLimit"), 180, 500)
    const latestLimit = parseLimit(searchParams.get("latestLimit"), 40, 100)
    const developingLimit = parseLimit(searchParams.get("developingLimit"), 24, 80)
    const mainStoryLimit = parseLimit(searchParams.get("mainStoryLimit"), 12, 40)
    const moreStoryLimit = parseLimit(searchParams.get("moreStoryLimit"), 28, 100)
    const quickBriefLimit = parseLimit(searchParams.get("quickBriefLimit"), 30, 100)
    const bypassCache = searchParams.get("cache") === "false" || searchParams.get("fresh") === "true"

    const { feed, cache } = await getCachedAppFeed({
      topicLimit,
      latestLimit,
      developingLimit,
      mainStoryLimit,
      moreStoryLimit,
      quickBriefLimit,
      bypassCache,
    })

    return apiSuccess(feed, {
      input: {
        topicLimit,
        latestLimit,
        developingLimit,
        mainStoryLimit,
        moreStoryLimit,
        quickBriefLimit,
        cache: bypassCache ? "bypass" : "default",
      },
      cache,
      generatedAt: feed.generatedAt,
    })
  } catch (error) {
    console.error("Failed to build app feed:", error)
    return apiError("Failed to build app feed", 500)
  }
}
