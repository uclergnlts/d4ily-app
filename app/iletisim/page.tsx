import { ContactClient } from "@/components/contact-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "İletişim - D4ily | Bize Ulaşın",
    description: "D4ily ekibi ile iletişime geçin. Soru, öneri, işbirliği teklifleri ve geri bildirimleriniz için bize ulaşabilirsiniz.",
    keywords: ["d4ily iletişim", "bize ulaşın", "iletişim formu", "d4ily destek"],
    openGraph: {
        title: "İletişim - D4ily",
        description: "D4ily ekibi ile iletişime geçin. Görüşleriniz bizim için değerli.",
        type: "website",
        url: "https://d4ily.com/iletisim",
    },
    alternates: {
        canonical: "https://d4ily.com/iletisim",
    },
}

export default function ContactPage() {
    return <ContactClient />
}
