
import { getMoreNews } from "@/app/actions/news";
import Link from "next/link";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { NewsFeed } from "@/components/news-feed";

export const metadata = {
    title: "Tüm Haberler - D4ily",
    description: "Güncel haberlerin tamamı.",
};

export const revalidate = 900; // 15 mins

export default async function NewsPage() {
    // Fetch initial data (page 1)
    const initialNews = await getMoreNews(1);

    return (
        <div className="min-h-screen bg-background pb-20">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-serif font-bold text-2xl lg:text-3xl text-foreground">Tüm Haberler</h1>
                    <span className="text-sm text-muted-foreground">
                        En güncel gelişmeler anlık olarak burada
                    </span>
                </div>

                <NewsFeed initialNews={initialNews} />
            </main>
            <Footer />
        </div>
    );
}
