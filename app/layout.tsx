import type React from "react"
import type { Metadata, Viewport } from "next"
import { Merriweather, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import ReadingProgress from "@/components/reading-progress"
import ScrollToTop from "@/components/scroll-to-top"
import "./globals.css"

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://d4ily.com"),
  title: {
    default: "D4ily - Türkiye Günlük Haber Özeti | 5 Dakikada Gündem",
    template: "%s | D4ily",
  },
  description:
    "Türkiye gündemini her gün yapay zeka ile analiz edip özetliyoruz. 500+ tweet hesabı, 50+ haber kaynağı. 5 dakikada tüm önemli gelişmeler.",
  generator: "Next.js",
  applicationName: "D4ily",
  keywords: [
    "türkiye haberleri",
    "gündem özeti",
    "haber özeti",
    "günlük haber",
    "türkiye gündemi",
    "son dakika",
    "haber bülteni",
    "yapay zeka haber",
    "ai haber özeti",
    "twitter özeti",
    "güncel haberler",
    "türkiye gündem özeti",
    "podcast haber",
    "sesli haber özeti",
    "daily digest",
  ],
  authors: [{ name: "D4ily", url: "https://d4ily.com" }],
  creator: "D4ily",
  publisher: "D4ily",
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://d4ily.com",
    languages: {
      "tr-TR": "https://d4ily.com",
    },
    types: {
      "application/rss+xml": "https://d4ily.com/rss.xml",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "D4ily",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://d4ily.com",
    siteName: "D4ily",
    title: "D4ily - Türkiye Günlük Haber Özeti",
    description: "Türkiye gündemini her gün yapay zeka ile analiz edip özetliyoruz. 5 dakikada tüm önemli gelişmeler.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "D4ily - Türkiye Günlük Haber Özeti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@d4ilytr",
    creator: "@d4ilytr",
    title: "D4ily - Türkiye Günlük Haber Özeti",
    description: "Türkiye gündemini her gün yapay zeka ile analiz edip özetliyoruz. 5 dakikada tüm önemli gelişmeler.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "YOUR_GOOGLE_SITE_VERIFICATION_CODE",
  // },
  category: "news",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${merriweather.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PB68GL3Z68" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PB68GL3Z68');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              name: "D4ily",
              url: "https://d4ily.com",
              logo: {
                "@type": "ImageObject",
                url: "https://d4ily.com/icons/icon-512x512.jpg",
                width: 512,
                height: 512,
              },
              description: "Türkiye gündemini her gün yapay zeka ile analiz edip özetliyoruz.",
              sameAs: ["https://twitter.com/d4ilytr"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                availableLanguage: ["Turkish"],
              },
              foundingDate: "2025",
              knowsAbout: ["Türkiye haberleri", "Gündem", "Politika", "Ekonomi", "Yapay Zeka"],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "D4ily",
              url: "https://d4ily.com",
              description: "Türkiye günlük haber özeti",
              inLanguage: "tr-TR",
              publisher: {
                "@type": "Organization",
                name: "D4ily",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://d4ily.com/arsiv?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="font-serif antialiased">
        <ReadingProgress />
        {children}
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
