import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Home, Archive, AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Sayfa Bulunamadi</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Aradiginiz sayfa mevcut degil veya bu tarih icin henuz bir ozet yayinlanmamis olabilir.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
          <Link
            href="/arsiv"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Archive className="h-4 w-4" />
            Arsiv
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
