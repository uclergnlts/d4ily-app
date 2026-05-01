import { desc, eq, sql } from "drizzle-orm"

import { getAgendaTopics, getMissedAgendaAlerts, type AgendaTopic } from "@/lib/api/agenda"
import { getCoverageReport } from "@/lib/api/coverage"
import { db } from "@/lib/db"
import { agendaSnapshots, ingestionRuns, qualityEvaluations } from "@/lib/db/schema"

type IngestionRunPatch = {
  status?: "running" | "success" | "partial" | "failed"
  completedAt?: string
  durationMs?: number
  processedCount?: number
  fetchedCount?: number
  insertedCount?: number
  errorCount?: number
  skippedCount?: number
  freshnessWindowHours?: number
  stoppedEarly?: boolean
  details?: unknown
}

export async function startIngestionRun(runType: string, details?: unknown) {
  const [run] = await db.insert(ingestionRuns).values({
    run_type: runType,
    status: "running",
    details,
  }).returning({ id: ingestionRuns.id, startedAt: ingestionRuns.started_at })

  return run
}

export async function finishIngestionRun(id: number, patch: IngestionRunPatch) {
  const completedAt = patch.completedAt ?? new Date().toISOString()
  const [run] = await db.update(ingestionRuns)
    .set({
      status: patch.status ?? "success",
      completed_at: completedAt,
      duration_ms: patch.durationMs,
      processed_count: patch.processedCount,
      fetched_count: patch.fetchedCount,
      inserted_count: patch.insertedCount,
      error_count: patch.errorCount,
      skipped_count: patch.skippedCount,
      freshness_window_hours: patch.freshnessWindowHours,
      stopped_early: patch.stoppedEarly,
      details: patch.details,
    })
    .where(eq(ingestionRuns.id, id))
    .returning()

  return run
}

export async function listIngestionRuns(limit = 25, runType?: string | null) {
  const rows = await db
    .select()
    .from(ingestionRuns)
    .where(runType ? eq(ingestionRuns.run_type, runType) : undefined)
    .orderBy(desc(ingestionRuns.started_at))
    .limit(limit)

  return rows
}

function getSnapshotKey() {
  const now = new Date()
  const bucket = now.toISOString().slice(0, 13)
  return `${bucket}:agenda`
}

export async function createAgendaSnapshot() {
  const [topics, missedAlerts, coverage] = await Promise.all([
    getAgendaTopics(1000, "all"),
    getMissedAgendaAlerts(200),
    getCoverageReport(),
  ])
  const payload = {
    generatedAt: new Date().toISOString(),
    windowHours: 24,
    coverage: {
      summary: coverage.summary,
      sourceCoverage: coverage.sourceCoverage,
    },
    counts: {
      topics: topics.length,
      lead: topics.filter((topic) => topic.agendaTier === "lead").length,
      major: topics.filter((topic) => topic.agendaTier === "major").length,
      singleSource: topics.filter((topic) => topic.agendaTier === "single_source").length,
      missedAlerts: missedAlerts.length,
    },
    topics: topics.slice(0, 250),
    missedAlerts,
  }
  const snapshotKey = getSnapshotKey()
  const [snapshot] = await db.insert(agendaSnapshots).values({
    snapshot_key: snapshotKey,
    window_hours: 24,
    topic_count: topics.length,
    lead_count: payload.counts.lead,
    missed_alert_count: missedAlerts.length,
    source_coverage_score: coverage.summary.sourceCoverageScore,
    payload,
  }).onConflictDoUpdate({
    target: [agendaSnapshots.snapshot_key],
    set: {
      topic_count: topics.length,
      lead_count: payload.counts.lead,
      missed_alert_count: missedAlerts.length,
      source_coverage_score: coverage.summary.sourceCoverageScore,
      payload,
    },
  }).returning()

  return snapshot
}

export async function listAgendaSnapshots(limit = 24) {
  return db
    .select({
      id: agendaSnapshots.id,
      snapshotKey: agendaSnapshots.snapshot_key,
      windowHours: agendaSnapshots.window_hours,
      topicCount: agendaSnapshots.topic_count,
      leadCount: agendaSnapshots.lead_count,
      missedAlertCount: agendaSnapshots.missed_alert_count,
      sourceCoverageScore: agendaSnapshots.source_coverage_score,
      createdAt: agendaSnapshots.created_at,
    })
    .from(agendaSnapshots)
    .orderBy(desc(agendaSnapshots.created_at))
    .limit(limit)
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function tokens(value: string) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length >= 3)
}

function matchExpectedItem(expected: string, topics: AgendaTopic[]) {
  const expectedTokens = tokens(expected)
  if (expectedTokens.length === 0) return null

  return topics
    .map((topic) => {
      const haystack = new Set(tokens(`${topic.title} ${topic.summary} ${topic.keywords.join(" ")}`))
      const matches = expectedTokens.filter((token) => haystack.has(token)).length
      return {
        topic,
        score: matches / Math.max(expectedTokens.length, 1),
        matches,
      }
    })
    .filter((item) => item.matches >= Math.min(2, expectedTokens.length) || item.score >= 0.5)
    .sort((left, right) => right.score - left.score || right.topic.agendaScore - left.topic.agendaScore)[0] ?? null
}

export async function evaluateAgendaQuality(expectedItems: string[], options?: {
  evaluationDate?: string
  save?: boolean
}) {
  const topics = await getAgendaTopics(1000, "all")
  const matchedItems = expectedItems.map((expected) => {
    const match = matchExpectedItem(expected, topics)
    return {
      expected,
      matched: Boolean(match),
      score: match ? Math.round(match.score * 100) : 0,
      topic: match ? {
        id: match.topic.id,
        slug: match.topic.slug,
        title: match.topic.title,
        agendaScore: match.topic.agendaScore,
        sourceCount: match.topic.sourceCount,
        signalCount: match.topic.signalCount,
        evidencePackage: match.topic.evidencePackage,
      } : null,
    }
  })
  const missedItems = matchedItems.filter((item) => !item.matched)
  const recallScore = expectedItems.length > 0
    ? Math.round(((expectedItems.length - missedItems.length) / expectedItems.length) * 100)
    : 0
  const precisionHintScore = Math.max(0, Math.min(100, Math.round(
    topics.filter((topic) => topic.agendaTier !== "routine").length / Math.max(topics.length, 1) * 100,
  )))
  const result = {
    evaluationDate: options?.evaluationDate ?? new Date().toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    expectedCount: expectedItems.length,
    matchedCount: matchedItems.filter((item) => item.matched).length,
    missedCount: missedItems.length,
    recallScore,
    precisionHintScore,
    matchedItems,
    missedItems,
    topExtraItems: topics
      .filter((topic) => topic.agendaTier !== "routine")
      .slice(0, 20)
      .map((topic) => ({
        title: topic.title,
        slug: topic.slug,
        agendaScore: topic.agendaScore,
        sourceCount: topic.sourceCount,
        signalCount: topic.signalCount,
      })),
  }

  if (options?.save) {
    await db.insert(qualityEvaluations).values({
      evaluation_date: result.evaluationDate,
      expected_items: expectedItems,
      matched_items: matchedItems,
      missed_items: missedItems,
      extra_items: result.topExtraItems,
      recall_score: recallScore,
      precision_hint_score: precisionHintScore,
    })
  }

  return result
}

export async function listQualityEvaluations(limit = 25) {
  return db
    .select()
    .from(qualityEvaluations)
    .orderBy(desc(qualityEvaluations.created_at))
    .limit(limit)
}

export async function getObservabilitySummary() {
  const [runs, snapshots, evaluations] = await Promise.all([
    listIngestionRuns(10),
    listAgendaSnapshots(10),
    listQualityEvaluations(10),
  ])
  const failedRuns24h = await db.all(sql`
    SELECT COUNT(*) as count
    FROM ingestion_runs
    WHERE started_at >= datetime('now', '-1 day')
      AND status IN ('failed', 'partial')
  `) as Array<{ count: number }>

  return {
    generatedAt: new Date().toISOString(),
    ingestion: {
      latestRuns: runs,
      failedOrPartialRuns24h: failedRuns24h[0]?.count ?? 0,
    },
    snapshots: {
      latest: snapshots[0] ?? null,
      recent: snapshots,
    },
    quality: {
      latest: evaluations[0] ?? null,
      recent: evaluations,
    },
  }
}
