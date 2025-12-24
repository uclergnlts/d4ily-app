import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Arşiv - Geçmiş Gündem Özetleri",
  description:
    "D4ily arşivi - Geçmiş günlerin Türkiye gündem özetlerine göz atın. Tüm özetler, tarih bazlı arama ve filtreleme.",
  alternates: {
    canonical: "https://d4ily.com/arsiv",
  },
  openGraph: {
    title: "Arşiv - Geçmiş Gündem Özetleri | D4ily",
    description: "Geçmiş günlerin Türkiye gündem özetlerine göz atın.",
    url: "https://d4ily.com/arsiv",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "D4ily Arşiv - Geçmiş Gündem Özetleri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arşiv - Geçmiş Gündem Özetleri | D4ily",
    description: "Geçmiş günlerin Türkiye gündem özetlerine göz atın.",
    images: ["/og-image.jpg"],
  },
}

export default function ArsivLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
