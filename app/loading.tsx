import { Newspaper, Calendar, FileText, Clock } from "lucide-react"

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero skeleton with shimmer */}
      <div className="bg-primary px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Logo skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-foreground/10 skeleton-shimmer" />
            <div className="h-6 w-20 rounded bg-primary-foreground/10 skeleton-shimmer" />
          </div>

          {/* Title skeleton */}
          <div className="mb-4 h-10 w-full max-w-lg rounded-lg bg-primary-foreground/10 skeleton-shimmer" />
          <div className="mb-4 h-10 w-full max-w-md rounded-lg bg-primary-foreground/10 skeleton-shimmer" />

          {/* Subtitle skeleton */}
          <div className="mb-8 h-5 w-full max-w-sm rounded bg-primary-foreground/10 skeleton-shimmer" />

          {/* Stats skeleton */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-foreground/30 skeleton-pulse" />
              <div className="h-4 w-24 rounded bg-primary-foreground/10 skeleton-shimmer" />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-foreground/30 skeleton-pulse" />
              <div className="h-4 w-20 rounded bg-primary-foreground/10 skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Section title */}
        <div className="mb-6 flex items-center gap-3">
          <Newspaper className="h-6 w-6 text-muted-foreground/50 skeleton-pulse" />
          <div className="h-7 w-48 rounded-lg bg-muted skeleton-shimmer" />
        </div>

        {/* Content card skeleton */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {/* Card header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-5 w-5 rounded bg-muted skeleton-shimmer" />
            <div className="h-6 w-40 rounded bg-muted skeleton-shimmer" />
          </div>

          {/* Content lines */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 rounded bg-muted skeleton-shimmer" style={{ width: 100 - i * 5 + "%" }} />
                {i < 4 && <div className="h-4 rounded bg-muted skeleton-shimmer" style={{ width: 85 - i * 8 + "%" }} />}
              </div>
            ))}
          </div>

          {/* Section divider skeleton */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <FileText className="h-4 w-4 text-muted-foreground/30 skeleton-pulse" />
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* More content lines */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 rounded bg-muted skeleton-shimmer" style={{ width: 95 - i * 10 + "%" }} />
                <div className="h-4 rounded bg-muted skeleton-shimmer" style={{ width: 80 - i * 5 + "%" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
