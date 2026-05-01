import { apiError, apiSuccess } from "@/lib/api/response"
import { getAgendaTopicBySlug } from "@/lib/api/agenda"

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const topic = await getAgendaTopicBySlug(slug)

    if (!topic) {
      return apiError("Agenda topic not found", 404)
    }

    return apiSuccess(topic)
  } catch (error) {
    console.error("Failed to fetch agenda topic:", error)
    return apiError("Failed to fetch agenda topic", 500)
  }
}
