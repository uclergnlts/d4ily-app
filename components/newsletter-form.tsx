"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function NewsletterForm() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) return

        setStatus("loading")
        setMessage("")

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (data.success) {
                setStatus("success")
                setMessage(data.message)
                setEmail("")
            } else {
                setStatus("error")
                setMessage(data.message)
            }
        } catch (error) {
            setStatus("error")
            setMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
        }
    }

    return (
        <div className="max-w-md mx-auto relative group">
            <div className={cn(
                "absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 transition duration-1000",
                status === "idle" && "group-hover:opacity-50 group-hover:duration-200",
                status === "success" && "from-green-500 to-emerald-500 opacity-50",
                status === "error" && "from-red-500 to-orange-500 opacity-50"
            )} />

            <form
                className="relative flex rounded-full bg-background shadow-xl p-2 border border-border"
                onSubmit={handleSubmit}
            >
                <input
                    type="email"
                    placeholder="eposta@adresiniz.com"
                    className="flex-1 bg-transparent px-6 py-3 outline-none text-foreground placeholder:text-muted-foreground/50 w-full disabled:opacity-50"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading" || status === "success"}
                />
                <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className={cn(
                        "rounded-full px-8 py-3 font-semibold text-primary-foreground transition-all flex items-center gap-2 whitespace-nowrap min-w-[120px] justify-center",
                        status === "success" ? "bg-green-600 hover:bg-green-700" :
                            status === "error" ? "bg-red-600 hover:bg-red-700" :
                                "bg-primary hover:bg-primary/90"
                    )}
                >
                    {status === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : status === "success" ? (
                        <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Kayıtlı</span>
                        </>
                    ) : status === "error" ? (
                        <span>Tekrar Dene</span>
                    ) : (
                        <span>Kayıt Ol</span>
                    )}
                </button>
            </form>

            <div className="mt-4 flex items-center justify-center min-h-[20px]">
                {message ? (
                    <p className={cn(
                        "text-sm font-medium animate-in fade-in slide-in-from-top-1",
                        status === "success" ? "text-green-600 dark:text-green-400" :
                            status === "error" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                    )}>
                        {message}
                    </p>
                ) : (
                    <p className="text-xs text-muted-foreground">Spam yok, istediğiniz zaman çıkabilirsiniz.</p>
                )}
            </div>
        </div>
    )
}
