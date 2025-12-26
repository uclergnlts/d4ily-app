"use client"

import { Calendar, Clock, Download, Share2, Check, Loader2 } from "lucide-react"
import { useRef, useCallback, useState } from "react"
import { Button } from "@/components/ui/button"

interface SocialShareCardProps {
  date: string
  headline: string
  bulletPoints: string[]
  readingTime?: string
  showDownload?: boolean
  variant?: "square" | "story"
  coverImageUrl?: string
}

export function SocialShareCard({
  date,
  headline,
  bulletPoints,
  readingTime = "8 dakikalık özet",
  showDownload = false,
  variant = "square",
  coverImageUrl,
}: SocialShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) {
        return dateStr
      }
      return d.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  // Get day number
  const getDayNumber = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return ""
      return d.getDate().toString()
    } catch {
      return ""
    }
  }

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || isDownloading) return

    setIsDownloading(true)

    try {
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // High resolution
        backgroundColor: "#18181b", // zinc-900 matches background
        logging: false,
      })

      const dataUrl = canvas.toDataURL("image/png")

      const link = document.createElement("a")
      link.download = `d4ily-${date}.png`
      link.href = dataUrl
      link.click()

      setIsDownloading(false)
    } catch (error) {
      console.error("Download failed:", error)
      alert("İndirme başarısız oldu. Lütfen tekrar deneyin.")
      setIsDownloading(false)
    }
  }, [date, isDownloading])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`https://www.d4ily.com/${date}`)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement("input")
      input.value = `https://www.d4ily.com/${date}`
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }, [date])

  return (
    <div className="flex flex-col gap-4 w-full max-w-[540px] mx-auto">
      <div
        ref={cardRef}
        style={{ backgroundColor: "#18181b" }} // Fallback HEX
        className={`w-full ${variant === "story" ? "aspect-[9/16]" : "aspect-square"} p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden rounded-xl shadow-2xl`}
      >
        {/* Gradient Background using Standard CSS */}
        <div
          className="absolute inset-0 z-0 bg-zinc-900"
          style={{ background: "linear-gradient(to bottom right, #18181b, #27272a, #18181b)" }}
        />

        {coverImageUrl && (
          <>
            {/* Cover Background */}
            <div className="absolute inset-0 z-0">
              <img
                src={coverImageUrl}
                alt=""
                className="w-full h-full object-cover opacity-30"
                crossOrigin="anonymous"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, #09090b, rgba(24, 24, 27, 0.8), rgba(24, 24, 27, 0.6))" }}
              />
            </div>
          </>
        )}
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top right, rgba(23, 37, 84, 0.2), transparent, rgba(59, 7, 100, 0.1))" }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white" style={{ color: '#ffffff' }}>d4ily</h1>
              <div className="flex items-center gap-1.5 text-sm sm:text-base" style={{ color: '#a1a1aa' }}>
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{formatDate(date)}</span>
              </div>
            </div>
            {/* Day number badge */}
            <div
              className="flex flex-col items-center justify-center rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <span className="text-3xl sm:text-4xl font-black leading-none" style={{ color: '#ffffff' }}>{getDayNumber(date)}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider" style={{ color: '#a1a1aa' }}>Gün</span>
            </div>
          </div>

          {/* Main content - centered */}
          <div className="flex-1 flex flex-col justify-center py-4 sm:py-6">
            {/* Headline */}
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight mb-4 sm:mb-6 text-balance line-clamp-3"
              style={{ color: '#ffffff' }}
            >
              {headline}
            </h2>

            {/* Bullet points */}
            <ul className="space-y-1.5 sm:space-y-2">
              {bulletPoints.slice(0, 4).map((point, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" style={{ backgroundColor: '#3b82f6' }} />
                  <span className="text-sm sm:text-base leading-relaxed line-clamp-2" style={{ color: '#d4d4d8' }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between pt-3 sm:pt-4"
            style={{ borderTop: '1px solid rgba(63, 63, 70, 0.5)' }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2" style={{ color: '#a1a1aa' }}>
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-sm sm:text-base font-medium">{readingTime}</span>
            </div>
            <span className="text-sm sm:text-base font-medium" style={{ color: '#71717a' }}>www.d4ily.com</span>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div
          className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-32 h-32 sm:w-48 sm:h-48 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
        />
        <div
          className="absolute -bottom-16 -left-16 sm:-bottom-24 sm:-left-24 w-32 h-32 sm:w-48 sm:h-48 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
        />
      </div>

      {showDownload && (
        <div className="flex gap-2 w-full">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 gap-2 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-white"
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isDownloading ? "İndiriliyor..." : "PNG İndir"}
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="gap-2 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-white"
          >
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
            {isCopied ? "Kopyalandı" : "Link"}
          </Button>
        </div>
      )}
    </div>
  )
}

