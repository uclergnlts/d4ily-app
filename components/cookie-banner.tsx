"use client"

import { useState, useEffect } from "react"
import { Cookie, X } from "lucide-react"
import Link from "next/link"

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent")
        if (!consent) {
            // Show after 1 second delay
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "accepted")
        setIsVisible(false)
    }

    const rejectCookies = () => {
        localStorage.setItem("cookie-consent", "rejected")
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
            <div className="mx-auto max-w-4xl">
                <div className="relative rounded-xl border border-border bg-card/95 backdrop-blur-lg shadow-lg p-4 md:p-6">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                                <Cookie className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground text-sm md:text-base">🍪 Çerez Kullanımı</h3>
                                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                                    Size en iyi deneyimi sunmak için çerezleri kullanıyoruz.
                                    Analiz ve performans takibi için Google Analytics kullanılmaktadır.{" "}
                                    <Link href="/cerez-politikasi" className="text-primary hover:underline">
                                        Detaylı bilgi
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={rejectCookies}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                            >
                                Reddet
                            </button>
                            <button
                                onClick={acceptCookies}
                                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Kabul Et
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
