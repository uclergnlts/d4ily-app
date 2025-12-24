export default function SkeletonDigest() {
  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
      <div className="animate-pulse p-8 sm:p-10 lg:p-12">
        <div className="mb-10 border-b border-border/40 pb-8">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-4 w-32 rounded bg-muted"></div>
              <div className="h-4 w-20 rounded bg-muted"></div>
            </div>
          </div>
          <div className="h-6 w-3/4 rounded bg-muted mb-2"></div>
          <div className="h-6 w-1/2 rounded bg-muted"></div>
        </div>

        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-3/4 rounded bg-muted"></div>
          <div className="h-8 w-1/3 rounded bg-muted mt-8"></div>
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-2/3 rounded bg-muted"></div>
        </div>
      </div>
    </div>
  )
}
