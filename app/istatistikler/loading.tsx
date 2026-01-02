import { Header } from "@/components/header"

export default function StatisticsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header skeleton */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 h-16 w-16 animate-pulse rounded-2xl bg-secondary" />
            <div className="mb-2 h-8 w-48 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-64 animate-pulse rounded bg-secondary" />
          </div>

          {/* Stats cards skeleton */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 h-10 w-10 animate-pulse rounded-lg bg-secondary" />
                <div className="mb-2 h-8 w-16 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
              </div>
            ))}
          </div>

          {/* Category chart skeleton */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <div className="mb-4 h-6 w-48 animate-pulse rounded bg-secondary" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
                  <div className="h-3 flex-1 animate-pulse rounded-full bg-secondary" />
                  <div className="h-4 w-8 animate-pulse rounded bg-secondary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
