"use client"

import { Digest } from "@/lib/digest-data"
import Link from "next/link"
import Image from "next/image"

interface TrendingTopicsCirclesProps {
  digests?: Digest[]
}

export function TrendingTopicsCircles({ digests = [] }: TrendingTopicsCirclesProps) {
  // If no digests provided, show nothing or skeleton? 
  // For now, if empty, we might want to hide the section or show a fallback.
  // Although the user wants "Bugün", "Dün" etc.

  // Logic to format display name
  const formatLabel = (dateStr: string, index: number) => {
    // User request: "Her eklenen gündem en başa 'Bugün' adıyla gelecek"
    // So usually index 0 is "Bugün".
    if (index === 0) return "Bugün"

    // Check if yesterday?
    // Using simple date comparison or just index 1 = "Dün" if we assume daily cadence.
    // Let's try to be smart but also robust.
    // If we rely on index:
    if (index === 1) return "Dün"

    // Others: "26 Aralık" format
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })
    } catch (e) {
      return dateStr
    }
  }

  // Fallback if empty array passed for some reason (should be handled by parent but safe to have default)
  const displayItems = digests.length > 0 ? digests : []

  if (displayItems.length === 0) return null

  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Gündemler</h2>
          <Link
            href="/arsiv"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors group"
          >
            Hepsini Gör
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="flex items-center gap-6 lg:gap-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {displayItems.map((digest, index) => (
            <Link
              key={digest.id}
              href={`/${digest.digest_date}`}
              className="flex flex-col items-center gap-3 min-w-[90px] flex-shrink-0 group"
            >
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-3 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 relative">
                <Image
                  src={digest.cover_image_url || "/placeholder.jpg"}
                  alt={digest.title}
                  fill
                  className="object-cover"
                  priority={index < 3}
                />
              </div>
              <span className={`text-xs font-bold text-center transition-colors line-clamp-1 ${index === 0 ? "text-blue-600" : "text-gray-700 group-hover:text-blue-600"}`}>
                {formatLabel(digest.digest_date, index)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
