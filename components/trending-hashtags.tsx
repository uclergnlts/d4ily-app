"use client"

import { useEffect, useState } from "react"
import { Hash, TrendingUp } from "lucide-react"

interface Hashtag {
    tag: string
    count: number
}

export function TrendingHashtags() {
    const [hashtags, setHashtags] = useState<Hashtag[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/trending-hashtags')
            .then(res => res.json())
            .then(data => {
                setHashtags(data.hashtags || [])
                setIsLoading(false)
            })
            .catch(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <h2 className="font-bold text-lg">Gündemde</h2>
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 bg-secondary/50 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (hashtags.length === 0) {
        return null
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-orange-500 animate-pulse" />
                <h2 className="font-bold text-lg">Gündemde</h2>
                <span className="text-xs text-muted-foreground ml-auto">Son 24 saat</span>
            </div>

            <div className="space-y-2">
                {hashtags.map((item, idx) => (
                    <div
                        key={item.tag}
                        className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground w-6">#{idx + 1}</span>
                            <Hash className="h-4 w-4 text-primary" />
                            <span className="font-medium group-hover:text-primary transition-colors">
                                {item.tag.replace('#', '')}
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {item.count} tweet
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
