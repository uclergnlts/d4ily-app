"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Calendar, Radio, Archive, FileText, BookOpen } from "lucide-react"
import { Logo } from "@/components/logo"
import { AutoRefreshClient } from "@/components/auto-refresh-client"

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [todayUrl, setTodayUrl] = useState("/")

  useEffect(() => {
    setTodayUrl("/" + getTodayDate())
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-lg border-b border-gray-200 shadow-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Auto Refresh Indicator (Desktop) */}
          <div className="hidden xl:block ml-4">
            <AutoRefreshClient />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            <Link
              href={todayUrl}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              <Calendar className="h-4 w-4" />
              Gündem
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/akis"
              className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors relative group"
            >
              <Radio className="h-4 w-4 fill-red-500" />
              Canlı Akış
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
            </Link>
            {/* 'Haberler' route ambiguous, mapping to /arsiv or similar if specific page doesn't exist. Using /arsiv as fallback or maybe /kategori/haberler if implemented */}
            <Link
              href="/haberler"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              <FileText className="h-4 w-4" />
              Haberler
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/arsiv"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              <Archive className="h-4 w-4" />
              Arşiv
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/haftalik-ozet"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              <BookOpen className="h-4 w-4" />
              Haftalık Özet
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button size="sm" className="hidden lg:flex font-bold shadow-md hover:shadow-lg transition-shadow">
              Abone Ol
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top">
            <nav className="flex flex-col gap-3">
              <Link
                href={todayUrl}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors py-2"
              >
                <Calendar className="h-4 w-4" />
                Gündem
              </Link>
              <Link
                href="/akis"
                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors py-2"
              >
                <Radio className="h-4 w-4 fill-red-500" />
                Canlı Akış
              </Link>
              <Link
                href="/haberler"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors py-2"
              >
                <FileText className="h-4 w-4" />
                Haberler
              </Link>
              <Link
                href="/arsiv"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors py-2"
              >
                <Archive className="h-4 w-4" />
                Arşiv
              </Link>
              <Link
                href="/haftalik-ozet"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors py-2"
              >
                <BookOpen className="h-4 w-4" />
                Haftalık Özet
              </Link>
              <div className="pt-4 border-t border-gray-200 mt-2">
                <Button size="sm" className="w-full font-semibold">
                  Abone Ol
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
