'use client'

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <WifiOff className="h-8 w-8 text-muted-foreground" />
                    </div>

                    <h1 className="text-2xl font-bold font-serif mb-3">Çevrimdışısınız</h1>

                    <p className="text-muted-foreground mb-6">
                        İnternet bağlantınız yok gibi görünüyor. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Tekrar Dene
                        </button>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            Ana Sayfaya Git
                        </Link>
                    </div>

                    <p className="text-xs text-muted-foreground mt-8">
                        Daha önce ziyaret ettiğiniz sayfalar çevrimdışı olarak görüntülenebilir.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
