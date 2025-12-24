import { SocialShareCard } from "@/components/social-share-card"
import { getTodayDigest } from "@/lib/digest-data"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Paylaşım Kartı | D4ily",
  description: "Günlük özeti sosyal medyada paylaşın",
}

export default async function SharePreviewPage() {
  const digest = await getTodayDigest()

  // Extract bullet points from digest content
  const extractBulletPoints = (content: string): string[] => {
    const lines = content.split("\n").filter((line) => line.trim())
    const bullets: string[] = []

    for (const line of lines) {
      // Look for lines starting with bullet points or dashes
      const cleanLine = line.replace(/^[-•*]\s*/, "").trim()
      if (cleanLine && cleanLine.length > 10 && cleanLine.length < 100) {
        bullets.push(cleanLine)
        if (bullets.length >= 4) break
      }
    }

    // If no bullets found, use first sentences
    if (bullets.length === 0) {
      const sentences = content.split(/[.!?]/).filter((s) => s.trim().length > 20)
      return sentences.slice(0, 4).map((s) => s.trim().slice(0, 80) + "...")
    }

    return bullets
  }

  // Get today's date
  const today = new Date().toISOString().split("T")[0]

  // Default values if no digest
  // Fixed: Digest is a single object, not a list of items
  const headline = digest?.title || "Türkiye'nin Gündeminden Öne Çıkan Gelişmeler"
  const content = digest?.content || ""
  const bulletPoints = extractBulletPoints(content)

  // Fallback bullets if extraction fails
  const finalBullets =
    bulletPoints.length > 0
      ? bulletPoints
      : ["Günün önemli gelişmeleri", "Ekonomi haberleri", "Siyaset gündemi", "Dünyadan haberler"]

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:py-12">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Sosyal Medya Paylaşım Kartı</h1>
          <p className="text-sm sm:text-base text-zinc-400">Aşağıdaki kartı indirip sosyal medyada paylaşabilirsiniz</p>
        </div>

        <SocialShareCard date={today} headline={headline} bulletPoints={finalBullets} showDownload />

        <div className="mt-6 sm:mt-8 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <h3 className="text-sm font-semibold text-white mb-2">Kullanım İpuçları</h3>
          <ul className="text-xs sm:text-sm text-zinc-400 space-y-1">
            <li>• Instagram, Twitter ve Facebook için ideal boyut</li>
            <li>• PNG olarak indirip doğrudan paylaşabilirsiniz</li>
            <li>• Link butonuyla gündem linkini kopyalayabilirsiniz</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
