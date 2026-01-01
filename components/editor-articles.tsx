"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface EditorArticlesProps {
  articles?: any[] // Using any strictly to match current pattern, ideally NewsItem[]
}

export function EditorArticles({ articles = [] }: EditorArticlesProps) {
  // Use passed articles or empty array. 
  // If we want to show anything when empty, we could keep static fallback or show nothing.
  // For now, if empty, we hide the section or show placeholder? 
  // Let's just render what we have.

  if (!articles || articles.length === 0) return null

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold">Editör Yazıları</h2>
          <Button variant="link" asChild className="text-primary gap-1 px-0">
            <Link href="/yazarlar">
              Hepsini Gör
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <Link key={article.id || index} href={`/haber/${article.id}`} className="block group">
              <div className="relative h-[280px] rounded-xl overflow-hidden cursor-pointer">
                <Image
                  src={article.image_url || `/placeholder.svg?height=280&width=400&query=${article.title}`}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold bg-primary/80 rounded w-fit">
                    {article.category || "Analiz"}
                  </span>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-white/90 line-clamp-2">{article.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
