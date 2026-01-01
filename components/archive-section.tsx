"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Digest } from "@/lib/digest-data"
import { useState } from "react"
import Link from 'next/link'

interface ArchiveSectionProps {
  digests?: Digest[]
}

export function ArchiveSection({ digests = [] }: ArchiveSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter out the very latest digest if it's already shown in TrendingTopicsCircles?
  // Or just show all? Usually Archive excludes "Today". 
  // Let's assume we show what's passed. If page.tsx passes all, we show all.
  // Maybe page.tsx should pass digests.slice(1) to this component? 
  // For now, let's just handle whatever is passed.

  const hasDigests = digests && digests.length > 0
  const currentDigest = hasDigests ? digests[currentIndex] : null

  const handleNext = () => {
    if (!hasDigests) return
    setCurrentIndex((prev) => (prev + 1) % digests.length)
  }

  const handlePrev = () => {
    if (!hasDigests) return
    setCurrentIndex((prev) => (prev - 1 + digests.length) % digests.length)
  }

  if (!hasDigests || !currentDigest) {
    return null // Or return a "No archives found" state
  }

  return (
    <section className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl lg:text-2xl font-bold">Gündem Arşivi</h2>
          <Button variant="link" asChild className="text-primary gap-2 hover:gap-3 transition-all">
            <Link href="/arsiv">
              Hepsini Gör
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-10 rounded-full bg-white hover:bg-gray-50 shadow-lg border-gray-200 hidden md:flex"
            aria-label="Önceki"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-10 rounded-full bg-white hover:bg-gray-50 shadow-lg border-gray-200 hidden md:flex"
            aria-label="Sonraki"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Archive Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow max-w-4xl mx-auto">
            <div className="md:flex">
              <div className="md:w-2/5 relative h-64 md:h-full">
                <Image
                  src={currentDigest.cover_image_url || "/placeholder.svg"}
                  alt={currentDigest.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:w-3/5 p-6 lg:p-8">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    Gündem
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {currentDigest.digest_date}
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-3 leading-tight line-clamp-2">{currentDigest.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-3">{currentDigest.intro}</p>
                <Button variant="link" asChild className="px-0 text-primary gap-2 hover:gap-3 transition-all font-semibold">
                  <Link href={`/turkiye-gundemi-${currentDigest.digest_date}`}>
                    Özeti Oku
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Dots (Optional enhancement) */}
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            {digests.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? "bg-primary w-4" : "bg-gray-300"
                  }`}
                aria-label={`Slayt ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
