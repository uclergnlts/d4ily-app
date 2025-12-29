"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Send, Check, Loader2 } from "lucide-react"

export default function EmailSubscription() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Lütfen geçerli bir e-posta adresi girin")
      return
    }

    setStatus("loading")

    setTimeout(() => {
      setStatus("success")
      setMessage("Başarıyla abone oldunuz! Her gün 06:00'da gündem özetiniz e-postanıza gelecek.")
      setEmail("")
    }, 1500)
  }

  return (
    <section className="mx-auto mt-8 max-w-3xl">
      <div className="overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/10 shadow-sm">
        <div className="px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">Günlük Özet E-postası</h2>
            <p className="mb-6 max-w-md text-sm text-muted-foreground sm:text-base">
              Her gün sabah 06:00&apos;da gündemin özetini e-postanıza gönderelim. Kahvenizi içerken Türkiye gündemini
              yakalayın.
            </p>

            {status === "success" ? (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-green-600">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (status === "error") setStatus("idle")
                    }}
                    placeholder="ornek@email.com"
                    className={
                      "w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 " +
                      (status === "error" ? "border-red-500" : "border-border")
                    }
                    disabled={status === "loading"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Gönderiliyor</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Abone Ol</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {status === "error" && <p className="mt-2 text-sm text-red-500">{message}</p>}

            <p className="mt-4 text-xs text-muted-foreground">
              İstediğiniz zaman abonelikten çıkabilirsiniz. Gizliliğinize saygı duyuyoruz.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
