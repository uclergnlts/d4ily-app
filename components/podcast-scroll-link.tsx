"use client"

import { PlayCircle } from "lucide-react"

export function PodcastScrollLink() {
    return (
        <a
            href="#podcast-section"
            onClick={(e) => {
                e.preventDefault()
                document.getElementById("podcast-section")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full border-2 border-input bg-background/50 backdrop-blur-sm px-8 text-lg font-medium transition-all hover:bg-accent hover:text-accent-foreground hover:border-primary/50"
        >
            <PlayCircle className="mr-2 h-5 w-5 text-primary" />
            Dinle (Podcast)
        </a>
    )
}
