"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Global Hata:", error)
    }, [error])

    return (
        <html lang="tr">
            <body className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 text-zinc-900 antialiased p-4 font-sans">
                <div className="flex flex-col items-center justify-center text-center max-w-md">
                    <div className="mb-8 p-6 bg-red-100/50 rounded-full">
                        <AlertTriangle className="h-12 w-12 text-red-600" />
                    </div>

                    <h2 className="mb-4 text-3xl font-bold tracking-tight">
                        Kritik Bir Hata Oluştu
                    </h2>

                    <p className="mb-8 text-zinc-600 leading-relaxed text-lg">
                        Sistemde beklenmedik bir durum oluştu. Yeniden yüklemeyi deneyerek sorunu çözebilirsiniz.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-95 shadow-xl"
                    >
                        <RefreshCcw className="h-5 w-5" />
                        Sayfayı Yenile
                    </button>
                </div>
            </body>
        </html>
    )
}
