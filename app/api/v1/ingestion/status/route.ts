import { getCoverageReport } from "@/lib/api/coverage"
import { apiError, apiSuccess } from "@/lib/api/response"

export async function GET() {
  try {
    const coverage = await getCoverageReport()
    const summary = coverage.summary
    const health =
      summary.notScannedWithin24h === 0 &&
      summary.accountsWithRecentErrors === 0 &&
      summary.stuckFetchAccounts === 0
        ? "ok"
        : summary.notScannedWithin24h > 0 || summary.stuckFetchAccounts > 0
          ? "attention"
          : "degraded"

    return apiSuccess({
      health,
      generatedAt: coverage.generatedAt,
      windowHours: coverage.windowHours,
      guarantees: {
        activeTwitterAccounts: summary.activeTwitterAccounts,
        scannedWithin24h: summary.activeTwitterAccounts - summary.notScannedWithin24h,
        notScannedWithin24h: summary.notScannedWithin24h,
        targetMissedAccounts: 0,
        sourceCoverageScore: summary.sourceCoverageScore,
      },
      fetchState: {
        dueAccounts: summary.dueAccounts,
        neverFetchedAccounts: summary.neverFetchedAccounts,
        accountsWithRecentErrors: summary.accountsWithRecentErrors,
        stuckFetchAccounts: summary.stuckFetchAccounts,
        accountsPerRun: summary.accountsPerRun,
        estimatedRunsForFullSweep: summary.estimatedRunsForFullSweep,
      },
      attention: {
        notScannedWithin24h: coverage.attention.notScannedWithin24h,
        accountsWithRecentErrors: coverage.attention.accountsWithRecentErrors,
        stuckFetchAccounts: coverage.attention.stuckFetchAccounts,
        neverFetchedAccounts: coverage.attention.neverFetchedAccounts,
      },
      sourceCoverage: coverage.sourceCoverage,
    })
  } catch (error) {
    console.error("Failed to fetch ingestion status:", error)
    return apiError("Failed to fetch ingestion status", 500)
  }
}
