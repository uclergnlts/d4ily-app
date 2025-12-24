import { Archive, Calendar, ChevronRight } from "lucide-react"

export default function ArsivLoading() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Page header skeleton */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <Archive className="h-8 w-8 text-muted-foreground/50 skeleton-pulse" />
            <div className="h-9 w-32 rounded-lg bg-muted skeleton-shimmer" />
          </div>
          <div className="h-5 w-64 rounded bg-muted skeleton-shimmer" />
        </div>

        {/* Digest cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
              style={{ animationDelay: i * 100 + "ms" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Date badge skeleton */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground/30 skeleton-pulse" />
                    <div className="h-4 w-28 rounded bg-muted skeleton-shimmer" />
                  </div>

                  {/* Title skeleton */}
                  <div className="h-6 w-full max-w-md rounded bg-muted skeleton-shimmer" />

                  {/* Preview text skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-muted skeleton-shimmer" />
                    <div className="h-4 rounded bg-muted skeleton-shimmer" style={{ width: 70 - i * 5 + "%" }} />
                  </div>
                </div>

                {/* Arrow icon skeleton */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted skeleton-shimmer">
                  <ChevronRight className="h-5 w-5 text-muted-foreground/30" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
