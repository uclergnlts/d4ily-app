"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Mail, Bell } from "lucide-react"

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("d4ily-popup-seen")
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 15000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("d4ily-popup-seen", "true")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus("success")
        localStorage.setItem("d4ily-popup-seen", "true")

        setTimeout(() => {
          setIsOpen(false)
        }, 2000)
      } else {
        setStatus("error")
        // Optionally show error message
      }
    } catch (error) {
      setStatus("error")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h2 className="mb-2 text-center font-display text-2xl font-bold text-foreground">Günlük Özeti Kaçırmayın</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Her sabah 06:00&apos;da Türkiye gündeminin özeti e-postanızda olsun.
          </p>

          {status === "success" ? (
            <div className="rounded-lg bg-emerald-50 p-4 text-center">
              <p className="font-medium text-emerald-700">Başarıyla abone oldunuz!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {status === "loading" ? "Kaydediliyor..." : "Abone Ol"}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            İstediğiniz zaman abonelikten çıkabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
