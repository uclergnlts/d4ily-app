import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export function FeaturedStory() {
  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">Bugünün Özeti</h2>
          <p className="text-muted-foreground">29 Aralık 2025</p>
        </div>
        <Badge variant="secondary" className="hidden lg:flex items-center gap-2">
          <Clock className="h-4 w-4" />5 dk okuma
        </Badge>
      </div>

      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative h-64 lg:h-full bg-muted overflow-hidden">
            <img
              src="/turkish-news-abstract-digital.jpg"
              alt="Bugünün ana haberi"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">GÜNDEM</Badge>
          </div>

          <CardContent className="p-6 lg:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl lg:text-3xl font-bold leading-tight text-balance">
                Uyuşturucu Soruşturmasında Veyis Ateş ve Ünlüler Gözaltında: Siyasette NATO İddiası
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                2025-12-29 sabahından herkese merhaba. Yılın son günlerine yaklaşırken, Türkiye gündemi bir yandan yoğun
                kar ve soğuk hava uyarılarıyla mücadele ederken, diğer yandan devam eden büyük operasyonlar ve siyasi
                polemiklerle şekilleniyor.
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>29 Ara 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>5 dk</span>
                </div>
              </div>
              <Button variant="ghost" className="gap-2">
                Özeti Oku
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  )
}
