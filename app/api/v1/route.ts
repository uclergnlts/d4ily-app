import { apiSuccess } from "@/lib/api/response"

const endpoints = [
  { method: "GET", path: "/api/v1/health", description: "Service and database health status" },
  { method: "GET", path: "/api/v1/agenda?limit=100", description: "All fresh agenda topics from the last 24 hours" },
  { method: "GET", path: "/api/v1/agenda?mode=featured&limit=20", description: "High-confidence agenda topics only" },
  { method: "GET", path: "/api/v1/agenda/{slug}", description: "Agenda topic detail with related signals" },
  { method: "GET", path: "/api/v1/signals?limit=500", description: "Full 24-hour signal firehose, including single-source items" },
  { method: "GET", path: "/api/v1/signals?singleSource=true&sort=newest", description: "Single-source signals in newest-first order" },
  { method: "GET", path: "/api/v1/signals?needsConfirmation=true&sort=newest", description: "Signals that need confirmation" },
  { method: "GET", path: "/api/v1/signals/pending?limit=100", description: "Single-source or low-confidence signals for editorial review" },
  { method: "GET", path: "/api/v1/alerts/missed?limit=50", description: "Missed-agenda alarm: single-source, high-impact, or confirmation-needed stories that must not disappear" },
  { method: "GET", path: "/api/v1/coverage", description: "24-hour Twitter source coverage and missed-account diagnostics" },
  { method: "GET", path: "/api/v1/observability", description: "Backend observability summary: recent ingestion runs, snapshots and quality evaluations" },
  { method: "GET", path: "/api/v1/ingestion/runs?limit=25", description: "Persisted ingestion run history" },
  { method: "GET", path: "/api/v1/agenda/snapshots?limit=24", description: "Recent persisted agenda snapshots" },
  { method: "POST", path: "/api/v1/agenda/snapshots", description: "Create or refresh the current hourly agenda snapshot" },
  { method: "GET", path: "/api/v1/quality/evaluate?limit=25", description: "Recent quality evaluations" },
  { method: "POST", path: "/api/v1/quality/evaluate", description: "Evaluate expected agenda items against detected topics" },
  { method: "GET", path: "/api/v1/package", description: "Frontend-ready 24-hour data package: firehose, featured agenda, pending signals, coverage summary" },
  { method: "GET", path: "/api/v1/feed", description: "Final frontend feed: AI news stories, latest signals, developing stories, alerts and coverage" },
  { method: "GET", path: "/api/v1/app-feed", description: "App-ready agenda feed: today agenda, live stream, actor reactions, developing and local agenda" },
  { method: "GET", path: "/api/v1/app-feed/{slug}", description: "App-ready story detail with clean copy, tweet evidence and related stories" },
  { method: "GET", path: "/api/v1/ai/briefing?limit=80", description: "AI-written news feed over the 24-hour X signal package" },
  { method: "GET", path: "/api/v1/ai/briefing?mode=editorial&limit=80", description: "Editorial/debug view of the AI briefing" },
  { method: "GET", path: "/api/v1/digests/today", description: "Latest published daily digest" },
  { method: "GET", path: "/api/v1/digests/{date}", description: "Published daily digest for YYYY-MM-DD" },
  { method: "GET", path: "/api/v1/news?limit=20", description: "Published mobile news feed" },
  { method: "GET", path: "/api/v1/articles?limit=20", description: "All published processed articles" },
  { method: "GET", path: "/api/v1/topics", description: "Topic taxonomy" },
  { method: "GET", path: "/api/v1/market", description: "Market snapshot" },
  { method: "GET", path: "/api/v1/tweets?limit=20&cursor=120", description: "Paginated tweet feed" },
]

export async function GET() {
  return apiSuccess({
    name: "D4ily Backend API",
    version: "v1",
    description: "Backend service for mobile and external clients.",
    endpoints,
  })
}
