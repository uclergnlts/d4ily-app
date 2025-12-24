"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getVisitorId } from "@/lib/visitor-id"

interface ReactionButtonsProps {
  digestId?: number
}

export default function ReactionButtons({ digestId }: ReactionButtonsProps) {
  const [reaction, setReaction] = useState<"helpful" | "not-helpful" | null>(null)
  const [counts, setCounts] = useState({ helpful: 0, notHelpful: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visitorId, setVisitorId] = useState<string>("")

  // Sayfa yuklendiginde mevcut oylari ve kullanici oyunu getir
  useEffect(() => {
    const vid = getVisitorId()
    setVisitorId(vid)

    if (digestId) {
      fetchReactions(digestId, vid)
    } else {
      setIsLoading(false)
    }
  }, [digestId])

  const fetchReactions = async (id: number, vid: string) => {
    try {
      const res = await fetch(`/api/reactions?digestId=${id}&visitorId=${vid}`)
      const data = await res.json()

      if (res.ok) {
        setCounts({ helpful: data.helpful, notHelpful: data.notHelpful })
        setReaction(data.userReaction)
      }
    } catch (error) {
      // Hata durumunda sessizce devam et
    } finally {
      setIsLoading(false)
    }
  }

  const handleReaction = async (type: "helpful" | "not-helpful") => {
    if (!digestId || !visitorId || isSubmitting) return

    setIsSubmitting(true)

    // Optimistic UI update
    const previousReaction = reaction
    const previousCounts = { ...counts }

    if (reaction === type) {
      // Ayni butona tiklanirsa oyu kaldir
      setReaction(null)
      setCounts((prev) => ({
        ...prev,
        [type === "helpful" ? "helpful" : "notHelpful"]: Math.max(
          0,
          prev[type === "helpful" ? "helpful" : "notHelpful"] - 1,
        ),
      }))
    } else {
      // Farkli oy
      if (reaction) {
        setCounts((prev) => ({
          ...prev,
          [reaction === "helpful" ? "helpful" : "notHelpful"]: Math.max(
            0,
            prev[reaction === "helpful" ? "helpful" : "notHelpful"] - 1,
          ),
        }))
      }
      setReaction(type)
      setCounts((prev) => ({
        ...prev,
        [type === "helpful" ? "helpful" : "notHelpful"]: prev[type === "helpful" ? "helpful" : "notHelpful"] + 1,
      }))
    }

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digestId, visitorId, reaction: type }),
      })

      if (!res.ok) {
        // Hata durumunda geri al
        setReaction(previousReaction)
        setCounts(previousCounts)
      }
    } catch (error) {
      // Hata durumunda geri al
      setReaction(previousReaction)
      setCounts(previousCounts)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-card p-5 text-center shadow-soft">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-xl border border-border bg-card p-5 text-center shadow-soft">
      <p className="mb-4 text-sm font-medium text-foreground">Bu özet faydalı oldu mu?</p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handleReaction("helpful")}
          disabled={isSubmitting}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50",
            reaction === "helpful"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
          )}
        >
          <ThumbsUp className={cn("h-4 w-4", reaction === "helpful" && "fill-current")} />
          <span>Evet ({counts.helpful})</span>
        </button>
        <button
          onClick={() => handleReaction("not-helpful")}
          disabled={isSubmitting}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50",
            reaction === "not-helpful"
              ? "bg-red-100 text-red-700"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
          )}
        >
          <ThumbsDown className={cn("h-4 w-4", reaction === "not-helpful" && "fill-current")} />
          <span>Hayır ({counts.notHelpful})</span>
        </button>
      </div>
      {reaction && <p className="mt-3 text-xs text-muted-foreground">Geri bildiriminiz için teşekkürler!</p>}
    </div>
  )
}
