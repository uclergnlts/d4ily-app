import { Badge } from "@/components/ui/badge"
import { Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { WeeklyDigest } from "@/lib/digest-data"

interface EditorPickProps {
  digest?: WeeklyDigest | null
}

export function EditorPick({ digest }: EditorPickProps) {
  // If no digest, we can either return null or show a skeleton/fallback.
  // Showing a fallback for now or the latest one if fetched properly.
  // Actually, if it's null, we probably shouldn't render "SON YAYINLANAN" wrongly.
  // But let's assume we might get null.

  if (!digest) return null

  const { title, intro, cover_image_url, week_number, year, week_id } = digest

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-foreground">Haftanın Özeti</h2>
          <Link
            href="/haftalik-ozet"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            Hepsini Gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <Link href={`/haftalik-ozet/${week_id}`}>
          <article className="relative rounded-xl overflow-hidden group cursor-pointer h-[380px] md:h-[420px]">
            <img
              src={cover_image_url || "/placeholder.jpg"}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/60 to-transparent" />

            <div className="absolute top-5 left-5">
              <Badge className="bg-green-500 hover:bg-green-500 text-white border-none text-xs font-semibold px-3 py-1.5 shadow-lg">
                SON YAYINLANAN
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-3 text-sm opacity-90">
                <span className="font-medium">Hafta {week_number} - {year}</span>
              </div>

              <h3 className="text-xl md:text-3xl font-bold mb-3 text-pretty leading-tight line-clamp-2">
                {title}
              </h3>

              <p className="text-sm md:text-base opacity-85 mb-5 max-w-3xl leading-relaxed line-clamp-2">
                {intro}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Haftalık Genel Bakış</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Detaylı Analiz</span>
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>
    </section>
  )
}
