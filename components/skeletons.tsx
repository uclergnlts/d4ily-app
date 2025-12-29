// Collection of skeleton loading components for better UX

export function SkeletonCard() {
    return (
        <div className="animate-pulse">
            <div className="aspect-video bg-muted rounded-lg mb-4" />
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
        </div>
    )
}

export function SkeletonArchiveItem() {
    return (
        <div className="animate-pulse flex gap-4 p-4 border-b border-border">
            <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
            </div>
        </div>
    )
}

export function SkeletonNewsCard() {
    return (
        <div className="animate-pulse bg-card border border-border rounded-lg overflow-hidden">
            <div className="h-48 bg-muted" />
            <div className="p-5 space-y-3">
                <div className="flex gap-2">
                    <div className="h-3 bg-muted rounded w-20" />
                    <div className="h-3 bg-muted rounded w-12" />
                </div>
                <div className="h-5 bg-muted rounded w-full" />
                <div className="h-5 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
            </div>
        </div>
    )
}

export function SkeletonTweet() {
    return (
        <div className="animate-pulse p-4 border-b border-border">
            <div className="flex gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                        <div className="h-4 bg-muted rounded w-24" />
                        <div className="h-4 bg-muted rounded w-16" />
                    </div>
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="flex gap-6 mt-3">
                        <div className="h-4 bg-muted rounded w-12" />
                        <div className="h-4 bg-muted rounded w-12" />
                        <div className="h-4 bg-muted rounded w-12" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SkeletonDigestDetail() {
    return (
        <div className="animate-pulse max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4 mb-8">
                <div className="h-4 bg-muted rounded w-32 mx-auto" />
                <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
                <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
                <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
            </div>

            {/* Audio player */}
            <div className="h-16 bg-muted rounded-xl mb-8" />

            {/* Content */}
            <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded" style={{ width: `${Math.random() * 30 + 70}%` }} />
                ))}
            </div>
        </div>
    )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(count)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

export function SkeletonNewsFeed() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
                <SkeletonNewsCard key={i} />
            ))}
        </div>
    )
}

export function SkeletonTicker() {
    return (
        <div className="animate-pulse h-8 bg-muted" />
    )
}

export function SkeletonStats() {
    return (
        <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-6 bg-card border border-border rounded-xl text-center">
                    <div className="h-8 bg-muted rounded w-16 mx-auto mb-2" />
                    <div className="h-4 bg-muted rounded w-12 mx-auto" />
                </div>
            ))}
        </div>
    )
}
