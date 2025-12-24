"use client"

import Link from "next/link"

import { Newspaper, Home, Archive, Menu, X, BarChart3, Zap, Calendar } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const todayUrl = "/" + getTodayDate()

  const isHomepage = pathname === "/"

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-border ${isHomepage ? "bg-background/95" : "bg-card/95"} backdrop-blur`}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Newspaper className="h-4 w-4 text-primary-foreground" />
          </div>
          D4ily
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-1 sm:flex">
          {!isHomepage && (
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Ana Sayfa
            </Link>
          )}
          <Link
            href={todayUrl}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Newspaper className="h-4 w-4" />
            Bugün
          </Link>
          <Link
            href="/akis"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Canlı Akış
          </Link>
          <Link
            href="/arsiv"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Archive className="h-4 w-4" />
            Arşiv
          </Link>
          <Link
            href="/istatistikler"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <BarChart3 className="h-4 w-4" />
            İstatistikler
          </Link>
          <Link
            href="/haftalik-ozet"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-500/10 hover:text-purple-700 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Haftalık Özet
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary sm:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-border bg-card px-4 py-3 sm:hidden">
          {!isHomepage && (
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <Home className="h-4 w-4" />
              Ana Sayfa
            </Link>
          )}
          <Link
            href={todayUrl}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <Newspaper className="h-4 w-4" />
            Bugün
          </Link>
          <Link
            href="/akis"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10"
          >
            <Zap className="h-4 w-4" />
            Canlı Akış
          </Link>
          <Link
            href="/arsiv"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <Archive className="h-4 w-4" />
            Arşiv
          </Link>
          <Link
            href="/istatistikler"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <BarChart3 className="h-4 w-4" />
            İstatistikler
          </Link>
          <Link
            href="/haftalik-ozet"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-500/10"
          >
            <Calendar className="h-4 w-4" />
            Haftalık Özet
          </Link>
        </div>
      )}
    </nav>
  )
}
