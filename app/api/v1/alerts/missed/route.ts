import { getMissedAgendaAlerts } from "@/lib/api/agenda"
import { apiError, apiSuccess, parseLimit } from "@/lib/api/response"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get("limit"), 50, 200)
    const alerts = await getMissedAgendaAlerts(limit)

    return apiSuccess(alerts, {
      count: alerts.length,
      criticalCount: alerts.filter((alert) => alert.alertLevel === "critical").length,
      highCount: alerts.filter((alert) => alert.alertLevel === "high").length,
      watchCount: alerts.filter((alert) => alert.alertLevel === "watch").length,
      windowHours: 24,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to fetch missed agenda alerts:", error)
    return apiError("Failed to fetch missed agenda alerts", 500)
  }
}
