import { FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ResmiGazete() {
  const decisions = [
    {
      title: "Elektrik Piyasasında Kapsamlı Değişiklikler:",
      content:
        "Enerji Piyasası Düzenleme Kurumu (EPDK) tarafından 7 farklı yönetmelikte (Depolama, Lisans, Dengeleme ve Yenilenebilir Enerji Kaynakları Destekleme dahil) kapsamlı düzenlemeler yapıldı.",
    },
    {
      title: "Sivil Havacılık Para Cezaları Yeniden Değerlendirildi:",
      content:
        "Türk Sivil Havacılık Kanunu kapsamında uygulanan idari para cezaları, yeniden değerleme oranı esas alınarak önemli ölçüde artırıldı (zamlandı).",
    },
    {
      title: "Anayasa Mahkemesi Kararları Yayımlandı:",
      content:
        "Anayasa Mahkemesi'nin esasa ilişkin (2024/203 ve 2025/42) ve bireysel başvuruya dair yeni kararları yayımlanarak hukuki alanda yeni içtihatlar oluşturuldu.",
    },
  ]

  return (
    <section className="bg-pink-50/50 dark:bg-red-950/20 py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold">Resmi Gazete</h2>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">BUGÜNÜN KARARLARI</p>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-border">
            <ul className="space-y-6">
              {decisions.map((decision, index) => (
                <li key={index} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-2" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{decision.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{decision.content}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-border">
              <Button variant="outline" className="w-full sm:w-auto group bg-transparent" asChild>
                <a href="#" className="flex items-center gap-2">
                  Resmi Gazete'yi İncele
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
