"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Clock, Calendar } from "lucide-react"

const podcasts = [
  {
    id: 1,
    title: "Türkiye Ekonomisinde Yeni Dönem",
    description: "Ekonomi uzmanlarıyla son gelişmeleri değerlendirdik",
    duration: "45 dk",
    date: "27 Aralık 2024",
    image: "/economic-podcast-cover.jpg",
  },
  {
    id: 2,
    title: "Dijital Dönüşüm ve Geleceğimiz",
    description: "Teknoloji liderlerinin geleceğe bakışı",
    duration: "38 dk",
    date: "25 Aralık 2024",
    image: "/tech-podcast-cover.png",
  },
  {
    id: 3,
    title: "Sağlık Politikalarında Yenilikler",
    description: "Sağlık Bakanı ile özel söyleşi",
    duration: "52 dk",
    date: "23 Aralık 2024",
    image: "/health-podcast-cover.png",
  },
]

export function PodcastSection() {
  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">D4ily Podcast</h2>
            <p className="text-muted-foreground">Gündemin nabzını tutan derinlemesine analizler</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white rounded-full">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span className="font-medium">Spotify'da Dinle</span>
            </div>
            <Button variant="outline">Tümünü Gör</Button>
          </div>
        </div>

        {/* Podcast Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((podcast) => (
            <Card key={podcast.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={podcast.image || "/placeholder.svg"}
                  alt={podcast.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-16 h-16 bg-[#1DB954] hover:bg-[#1ed760]">
                    <Play className="h-8 w-8 fill-current" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{podcast.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{podcast.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{podcast.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{podcast.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Spotify CTA */}
        <div className="mt-8 p-6 lg:p-8 bg-gradient-to-r from-[#1DB954] to-[#1ed760] rounded-2xl text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold mb-2">D4ily Podcast'i Spotify'da Takip Edin</h3>
              <p className="text-white/90">Yeni bölümleri kaçırmayın, hemen abone olun</p>
            </div>
            <Button size="lg" className="bg-white text-[#1DB954] hover:bg-gray-100 font-bold">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              Spotify'da Abone Ol
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
