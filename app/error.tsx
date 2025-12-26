"use client" // Error components must be Client Components

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Uygulama Hatası:", error)
    }, [error])

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 shadow-xl border border-red-200 dark:border-red-900">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>
            </div>

            <h2 className="mb-3 font-serif text-3xl font-bold text-foreground">
                Bir şeyler ters gitti
            </h2>

            <p className="mb-8 max-w-md text-muted-foreground leading-relaxed">
                Beklenmedik bir hata oluştu. Teknik ekibimiz durumdan haberdar edildi.
                Lütfen sayfayı yenilemeyi deneyin.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="group flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
                >
                    <RefreshCcw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                    Tekrar Dene
                </button>

                <Link
                    href="/"
                    className="flex h-11 items-center justify-center rounded-full border border-input bg-background px-8 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <Home className="mr-2 h-4 w-4" />
                    Ana Sayfaya Dön
                </Link>
            </div>

            {process.env.NODE_ENV === 'development' && (
                <div className="mt-12 w-full max-w-2xl overflow-hidden rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20 p-4 text-left">
                    <p className="mb-2 font-mono text-xs font-bold text-red-700 dark:text-red-400">Geliştirici Hata Detayı:</p>
                    <pre className="overflow-auto whitespace-pre-wrap font-mono text-xs text-red-600/80 dark:text-red-400/80">
                        {error.message}
                        {error.stack && `\n\n${error.stack}`}
                    </pre>
                </div>
            )}
        </div>
    )
}
