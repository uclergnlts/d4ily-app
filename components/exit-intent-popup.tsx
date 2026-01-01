"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [hasShown, setHasShown] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const shown = localStorage.getItem("exit-intent-shown")
        if (shown) setHasShown(true)

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown && !localStorage.getItem("exit-intent-shown")) {
                setIsVisible(true)
                setHasShown(true)
                localStorage.setItem("exit-intent-shown", "true")
            }
        }

        document.addEventListener("mouseleave", handleMouseLeave)
        return () => document.removeEventListener("mouseleave", handleMouseLeave)
    }, [hasShown])

    if (!mounted || !isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card p-0 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="absolute right-4 top-4 z-10">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="rounded-full bg-black/10 p-2 text-foreground/60 hover:bg-black/20 hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Kapat</span>
                    </button>
                </div>

                <div className="relative h-32 bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold font-display">Dur, Gitme! 🚀</h2>
                        <p className="mt-1 text-primary-foreground/90">Yarınki gündemi kaçırmak istemezsin.</p>
                    </div>
                    {/* Decorative shapes */}
                    <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                </div>

                <div className="p-6">
                    <p className="mb-6 text-muted-foreground text-center">
                        Her sabah Türkiye gündemini 5 dakikada, reklamsız ve tarafsız bir şekilde e-postana getirelim.
                    </p>

                    <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault()

                        const formData = new FormData(e.currentTarget)
                        const email = formData.get("email") as string
                        if (!email) return

                        const submitBtn = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement
                        if (submitBtn) submitBtn.disabled = true;

                        try {
                            const res = await fetch("/api/subscribe", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email }),
                            })

                            const data = await res.json()

                            if (res.ok && data.success) {
                                setIsVisible(false)
                                alert("Teşekkürler! Listeye eklendin. 🎉")
                            } else {
                                alert(data.message || "Bir hata oluştu.")
                            }
                        } catch (error) {
                            alert("Bir bağlantı hatası oluştu.")
                        } finally {
                            if (submitBtn) submitBtn.disabled = false;
                        }
                    }}>
                        <Input
                            name="email"
                            type="email"
                            placeholder="E-posta adresin..."
                            className="h-11 border-muted bg-muted/30"
                            required
                        />
                        <Button type="submit" className="w-full h-11 text-base font-medium">
                            Abone Ol ve Kapat
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            Spam yok, söz veriyoruz. İstediğin an ayrılabilirsin.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
