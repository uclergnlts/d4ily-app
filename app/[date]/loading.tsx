import { ArrowLeft, Calendar, Clock, FileText } from "lucide-react"

export default function DateLoading() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Back button skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4 text-muted-foreground/50 skeleton-pulse" />
          <div className="h-4 w-20 rounded bg-muted skeleton-shimmer" />
        </div>

        {/* Page header skeleton */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground/50 skeleton-pulse" />
            <div className="h-5 w-36 rounded bg-muted skeleton-shimmer" />
          </div>

          {/* Title skeleton */}
          <div className="mb-4 h-9 w-full max-w-lg rounded-lg bg-muted skeleton-shimmer" />

          {/* Meta info skeleton */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground/30 skeleton-pulse" />
              <div className="h-4 w-24 rounded bg-muted skeleton-shimmer" />
            </div>
          </div>
        </div>

        {/* Content card skeleton */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {/* Section header skeleton */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-5 w-5 rounded bg-muted skeleton-shimmer" />
            <div className="h-6 w-44 rounded bg-muted skeleton-shimmer" />
          </div>

          {/* Content paragraphs skeleton */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((section) => (
              <div key={section} className="space-y-3">
                {/* Section title */}
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground/30 skeleton-pulse" />
                  <div className="h-5 rounded bg-muted skeleton-shimmer" style={{ width: 30 + section * 10 + "%" }} />
                </div>

                {/* Section content lines */}
                <div className="space-y-2 pl-6">
                  {[1, 2, 3].map((line) => (
                    <div
                      key={line}
                      className="h-4 rounded bg-muted skeleton-shimmer"
                      style={{
                        width: 100 - line * 10 - section * 5 + "%",
                        animationDelay: section * 100 + line * 50 + "ms",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
