"use client"

import { Card } from "@/components/ui/card"
import { Calendar, TrendingUp, Users, MessageCircle } from "lucide-react"

export function WeeklySummary() {
  const summaries = [
    {
      day: "Pazartesi",
      date: "27 Aralık",
      title: "Ekonomi Zirvesi ve Yeni Düzenlemeler",
      highlights: [
        "Merkez Bankası faiz kararı açıklandı",
        "Asgari ücret görüşmeleri tamamlandı",
        "Dış ticaret rakamları açıklandı",
      ],
      engagement: "2.4K",
      trend: "+18%",
    },
    {
      day: "Salı",
      date: "28 Aralık",
      title: "Teknoloji ve Dijital Dönüşüm Hamlesi",
      highlights: [
        "Yapay zeka düzenlemeleri onaylandı",
        "5G altyapı yatırımları başladı",
        "Siber güvenlik yasası mecliste",
      ],
      engagement: "1.8K",
      trend: "+12%",
    },
    {
      day: "Çarşamba",
      date: "29 Aralık",
      title: "Eğitim Reformu ve Sağlık Politikaları",
      highlights: [
        "Yeni müfredat programı açıklandı",
        "Sağlık çalışanları için ek haklar",
        "Okul öncesi eğitim zorunlu hale geldi",
      ],
      engagement: "2.1K",
      trend: "+15%",
    },
  ]

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl lg:text-3xl font-bold">Haftalık Özet</h2>
          </div>
          <p className="text-muted-foreground">Bu haftanın en önemli gelişmelerini günlük olarak takip edin</p>
        </div>

        <div className="space-y-6">
          {summaries.map((summary, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-center">
                    <div className="font-bold text-sm">{summary.day}</div>
                    <div className="text-xs opacity-70">{summary.date}</div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3">{summary.title}</h3>
                  <ul className="space-y-2 mb-4">
                    {summary.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{summary.engagement} okuma</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>{summary.trend}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
            <MessageCircle className="h-4 w-4" />
            Tüm Haftalık Özetleri Gör
          </button>
        </div>
      </div>
    </section>
  )
}
