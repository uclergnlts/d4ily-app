"use client"

import { useState } from "react"
import { Twitter, MessageCircle, Link2, Check, Send } from "lucide-react"

interface ShareButtonsProps {
  title?: string
  date?: string
}

export default function ShareButtons({ title, date }: ShareButtonsProps = {}) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://d4ily.com/" + (date || "")

  const shareText = (title || "D4ily Gündem Özeti") + " - D4ily"

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) { }
  }

  const handleTwitterShare = () => {
    const url =
      "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(shareUrl)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleWhatsAppShare = () => {
    const url = "https://wa.me/?text=" + encodeURIComponent(shareText + " " + shareUrl)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleTelegramShare = () => {
    const url = "https://t.me/share/url?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(shareText)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 hidden text-sm text-muted-foreground sm:inline">Paylaş:</span>

      <button
        onClick={handleTwitterShare}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] transition-all hover:bg-[#1DA1F2] hover:text-white active:scale-90"
        aria-label="Twitter'da paylaş"
      >
        <Twitter className="h-4 w-4" />
      </button>

      <button
        onClick={handleWhatsAppShare}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white active:scale-90"
        aria-label="WhatsApp'ta paylaş"
      >
        <MessageCircle className="h-4 w-4" />
      </button>

      <button
        onClick={handleTelegramShare}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0088cc]/10 text-[#0088cc] transition-all hover:bg-[#0088cc] hover:text-white active:scale-90"
        aria-label="Telegram'da paylaş"
      >
        <Send className="h-4 w-4" />
      </button>

      <button
        onClick={handleCopyLink}
        className={
          "flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-90 " +
          (copied
            ? "bg-green-500 text-white"
            : "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground")
        }
        aria-label="Linki kopyala"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  )
}
