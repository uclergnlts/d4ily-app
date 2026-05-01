import { buildAppFeedStoryDetail } from "@/lib/api/app-feed"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

export const maxDuration = 60

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const relatedLimit = parseLimit(searchParams.get("relatedLimit"), 6, 20)
    const tweetLimit = parseLimit(searchParams.get("tweetLimit"), 20, 50)

    const story = await buildAppFeedStoryDetail(slug, {
      relatedLimit,
      tweetLimit,
    })

    if (!story) {
      return apiError("App feed story not found", 404)
    }

    return apiSuccess(story, {
      input: {
        slug,
        relatedLimit,
        tweetLimit,
      },
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to build app feed story detail:", error)
    return apiError("Failed to build app feed story detail", 500)
  }
}
