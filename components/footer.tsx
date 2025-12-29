"use client"

import type React from "react"
import { useState } from "react"
import { Newspaper, Send, Check, Loader2, ChevronDown, Music } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) return

    setStatus("loading")
    setTimeout(() => {
      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus("idle"), 3000)
    }, 1000)
  }

  const faqs = [
    {
      question: "D4ily nedir?",
      answer: "D4ily, Türkiye gündemini 5 dakikada öğrenebileceğiniz günlük özet platformudur.",
    },
    {
      question: "İçerik ne sıklıkta güncellenir?",
      answer: "Her gün yeni bir özet yayınlanır ve tüm arşive erişebilirsiniz.",
    },
    {
      question: "Sesli özet ücretsiz mi?",
      answer: "Evet, tüm içeriklerimiz tamamen ücretsizdir.",
    },
  ]

  return (
    <footer className="border-t border-border bg-card px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 pb-8 border-b border-border">
          <h2 className="text-center text-lg font-semibold text-foreground mb-4">S.S.S</h2>
          <div className="max-w-2xl mx-auto space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground text-sm">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index && <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Logo ve açıklama */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Newspaper className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">D4ily</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">4 in 1:</span>{" "}
              Gündem • Analiz • Trend • Özet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">5 dakikada Türkiye gündemi</p>
          </div>

          {/* Linkler - İçerik */}
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <h3 className="text-sm font-semibold text-foreground">İçerik</h3>
            <div className="flex flex-wrap justify-center gap-4 lg:flex-col lg:gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Ana Sayfa
              </Link>
              <Link href="/arsiv" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Arşiv
              </Link>
              <Link href="/haftalik-ozet" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Haftalık Özet
              </Link>
              <Link href="/akis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Canlı Akış
              </Link>
            </div>
          </div>

          {/* Linkler - Kurumsal */}
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <h3 className="text-sm font-semibold text-foreground">Kurumsal</h3>
            <div className="flex flex-wrap justify-center gap-4 lg:flex-col lg:gap-2">
              <Link href="/hakkimizda" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Biz Kimiz?
              </Link>
              <Link href="/gizlilik" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-kosullari" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Kullanım Koşulları
              </Link>
              <Link href="/cerez-politikasi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Çerez Politikası
              </Link>
            </div>
          </div>

          {/* Spotify follow button and Mini abonelik formu */}
          <div className="flex flex-col items-center gap-3 lg:items-end">
            <a
              href="https://open.spotify.com/show/1zytVKv9PQmGuKGhWLEzfU?si=d72b6680d2bd4af1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1ed760]"
            >
              <Music className="h-4 w-4" />
              <span>Spotify'da Takip Et</span>
            </a>
            {/* Mini abonelik formu */}
            <div className="flex flex-col items-center lg:items-end">
              <p className="mb-2 text-sm font-medium text-foreground">Günlük özet e-postası</p>
              {status === "success" ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Abone oldunuz!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta adresiniz"
                    className="w-48 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    disabled={status === "loading"}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
                  >
                    {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {currentYear} D4ily. Tüm hakları saklıdır. •{" "}
            <a
              href="https://uclergnlts.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Yapımcı
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
