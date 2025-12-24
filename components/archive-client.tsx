"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

const ITEMS_PER_PAGE = 10

const pageData = {
  dateFilterLabel: "Tarih",
  categoryFilterLabel: "Kategori",
  sortLabel: "Sırala",
  categories: [
    { value: "all", label: "Tümü" },
    { value: "economy", label: "Ekonomi" },
    { value: "politics", label: "Siyaset" },
    { value: "sports", label: "Spor" },
  ],
  sortOptions: [
    { value: "newest", label: "En Yeni" },
    { value: "oldest", label: "En Eski" },
  ],
  emptyMessage: "Henüz arşivlenmiş özet bulunamadı.",
}

interface ArchiveItem {
  id: number
  label: string
  title: string
  summary: string
  date: string
  readingTime: string
  href: string
  digest_date: string
  category: string
  coverImage?: string | null
}

export default function ArchiveClient({ items }: { items: ArchiveItem[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")

  const filteredDigests = useMemo(() => {
    let filtered = [...items]

    if (selectedDate) {
      filtered = filtered.filter((d) => d.digest_date === selectedDate)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((d) => d.category === selectedCategory)
    }

    if (sortOrder === "oldest") {
      filtered.reverse()
    }

    return filtered
  }, [items, selectedCategory, selectedDate, sortOrder])

  const totalPages = Math.ceil(filteredDigests.length / ITEMS_PER_PAGE)
  const paginatedDigests = filteredDigests.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap animate-slide-down">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">{pageData.dateFilterLabel}</label>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">{pageData.categoryFilterLabel}</label>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {pageData.categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">{pageData.sortLabel}</label>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            {pageData.sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {paginatedDigests.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">{pageData.emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedDigests.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col sm:flex-row gap-5 rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 animate-slide-up overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image Section */}
              <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Calendar className="w-8 h-8 opacity-50" />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-2 text-xs font-medium text-accent">{item.label}</div>
                <h2 className="mb-2 font-serif text-lg font-semibold text-gray-900 transition-colors group-hover:text-accent sm:text-xl line-clamp-2">
                  {item.title}
                </h2>
                <p className="mb-3 text-sm leading-relaxed text-gray-600 line-clamp-2">{item.summary}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-auto">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.date}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-400" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {item.readingTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Önceki
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-transform hover:scale-105 ${currentPage === page
                    ? "bg-accent text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              )
            })}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Sonraki
          </button>
        </div>
      )}
    </>
  )
}
