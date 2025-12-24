"use client"

import { Share2, Link2 } from "lucide-react"
import Image from "next/image"

interface HeroSectionProps {
  title?: string
  intro?: string
  date?: string
  coverImage?: string
  greetingText?: string
}

export default function HeroSection({ title, intro, date, coverImage, greetingText }: HeroSectionProps) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || "D4ily - Günlük Özet",
        url: window.location.href,
      })
    }
  }

  return (
    <article className="border-b border-border/60 bg-background px-4 py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground/70">
          {formattedDate}
        </p>

        <h1 className="mb-8 text-center font-display text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h1>

        {intro && <p className="mb-8 text-center text-lg leading-relaxed text-muted-foreground sm:text-xl">{intro}</p>}

        {greetingText && (
          <p className="mb-8 text-center font-serif text-base italic text-muted-foreground/70">{greetingText}</p>
        )}

        <div className="mb-10 flex items-center justify-between border-y border-border/40 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background shadow-soft">
              D4
            </div>
            <div>
              <span className="block text-sm font-semibold text-foreground">D4ily Editör</span>
              <span className="text-xs text-muted-foreground">Günlük özet</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              aria-label="Paylaş"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              aria-label="Link kopyala"
            >
              <Link2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {coverImage && (
          <div className="overflow-hidden rounded-xl shadow-soft-lg">
            <Image
              src={coverImage || "/placeholder.svg"}
              alt={title || "Günün kapak görseli"}
              width={800}
              height={450}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        )}
      </div>
    </article>
  )
}
