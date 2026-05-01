import { createAgendaSnapshot, listAgendaSnapshots } from "@/lib/api/observability"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 24, 100)
    const snapshots = await listAgendaSnapshots(limit)

    return apiSuccess(snapshots, {
      count: snapshots.length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to fetch agenda snapshots:", error)
    return apiError("Failed to fetch agenda snapshots", 500)
  }
}

export async function POST() {
  try {
    const snapshot = await createAgendaSnapshot()
    return apiSuccess(snapshot, {
      generatedAt: new Date().toISOString(),
    }, 201)
  } catch (error) {
    console.error("Failed to create agenda snapshot:", error)
    return apiError("Failed to create agenda snapshot", 500)
  }
}
