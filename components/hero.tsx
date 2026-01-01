import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, FileText, TrendingUp } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-16 lg:py-24 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary" className="text-xs lg:text-sm px-3 py-1">
              Yapay Zeka Destekli Analiz
            </Badge>
            <Badge variant="outline" className="text-xs lg:text-sm px-3 py-1">
              Haftalık Bülten Pazar 06:00'da
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-balance">
              Türkiye Gündemi, <span className="text-primary">5 Dakikada</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Her sabah, yüzlerce kaynak taranarak hazırlanan doğrulanmış özeti okuyun. Bilgi kirliliği yok, sadece
              önemli olan.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 lg:gap-8 max-w-2xl mx-auto pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary">
                <FileText className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <p className="text-2xl lg:text-4xl font-bold">500+</p>
              <p className="text-xs lg:text-sm text-muted-foreground">Kaynak</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Clock className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <p className="text-2xl lg:text-4xl font-bold">07:00</p>
              <p className="text-xs lg:text-sm text-muted-foreground">Her Sabah</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
              <p className="text-2xl lg:text-4xl font-bold">5 dk</p>
              <p className="text-xs lg:text-sm text-muted-foreground">Okuma Süresi</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="w-full sm:w-auto text-base px-8">
              Bugünün Özetini Oku
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 bg-transparent">
              Canlı Akış
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
