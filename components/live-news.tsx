import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Sparkles } from "lucide-react"

const newsItems = [
  {
    id: 1,
    category: "Dünya",
    title: "ABD semalarında korkunç kaza: İki helikopter çarpıştı, can kaybı var.",
    excerpt:
      "ABD'nin New Jersey eyaletindeki Hammonton kenti yakınlarında iki Enstrom tipi helikopter havada çarpıştı.",
    time: "05:44",
    source: "ntv.com.tr",
    image: "/helicopter-crash.jpg",
  },
  {
    id: 2,
    category: "Gündem",
    title: "Eski TBMM Başkanı Hüsamettin Cindoruk yoğun bakımda! Tedavisi sürüyor.",
    excerpt: "Eski TBMM Başkanı Hüsamettin Cindoruk, evde oksijen satürasyonunun düşmesi üzerine hastaneye kaldırıldı.",
    time: "05:44",
    source: "ntv.com.tr",
    image: "/hospital-intensive-care.jpg",
  },
  {
    id: 3,
    category: "Gündem",
    title: "Futbol bahis soruşturması genişliyor: Erden Timur dahil 24 kişi gözaltında",
    excerpt: "Futbolda yasa dışı bahis soruşturması kapsamında yeni bir operasyon düzenlendi.",
    time: "10:32",
    source: "bianet",
    image: "/investigation-police.jpg",
  },
  {
    id: 4,
    category: "Politika",
    title: "Cengiz Çiçek uyardı: Raporlarda öne çıkan tehlikeli eğilim: 'Kürtsüz demokrasi'",
    excerpt: "DEM Partili Cengiz Çiçek, komisyon raporlarında 'Kürtsüz demokrasi' eğiliminin öne çıktığını belirtti.",
    time: "10:32",
    source: "bianet",
    image: "/political-meeting.png",
  },
]

export function LiveNews() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl lg:text-3xl font-bold">Anlık Haber</h2>
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI Destekli
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground hidden lg:block">Her saat güncellenir</p>
      </div>

      <div className="space-y-4">
        {newsItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all duration-300 group">
            <div className="grid sm:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-0">
              <div className="relative h-48 sm:h-full bg-muted overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 text-xs bg-background/90 backdrop-blur-sm">
                  {item.category}
                </Badge>
              </div>

              <CardContent className="p-4 lg:p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg lg:text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.excerpt}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{item.source}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
