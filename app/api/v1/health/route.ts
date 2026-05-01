import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { apiError, apiSuccess } from "@/lib/api/response"

export async function GET() {
  try {
    await db.run(sql`select 1`)

    return apiSuccess({
      service: "ok",
      database: "ok",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return apiError("Health check failed", 500)
  }
}
