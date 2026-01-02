import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { getWeeklyDigestByWeekId } from "@/lib/digest-data";
import { Calendar, TrendingUp, FileText, MessageSquareText } from "lucide-react";
import ReactMarkdown from "react-markdown";

import ShareButtons from "@/components/share-buttons";

export async function generateMetadata({ params }: { params: { weekId: string } }) {
    const { weekId } = await params;
    const weeklyDigest = await getWeeklyDigestByWeekId(weekId);

    if (!weeklyDigest) {
        return {
            title: "Haftalık Özet Bulunamadı - D4ily",
        };
    }

    const ogSearchParams = new URLSearchParams();
    ogSearchParams.set("title", weeklyDigest.title);
    ogSearchParams.set("week", weeklyDigest.week_number.toString());
    ogSearchParams.set("date", `${new Date(weeklyDigest.start_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })} - ${new Date(weeklyDigest.end_date).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}`);

    return {
        title: `${weeklyDigest.title} - D4ily Haftalık Özet`,
        description: weeklyDigest.intro,
        openGraph: {
            images: [
                {
                    url: `/api/og/weekly?${ogSearchParams.toString()}`,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            images: [`/api/og/weekly?${ogSearchParams.toString()}`],
        },
    };
}

export default async function WeeklyDigestPage({ params }: { params: { weekId: string } }) {
    const { weekId } = await params;
    const weeklyDigest = await getWeeklyDigestByWeekId(weekId);

    if (!weeklyDigest) {
        notFound();
    }

    const startDate = new Date(weeklyDigest.start_date);
    const endDate = new Date(weeklyDigest.end_date);
    const dateRange = `${startDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })} - ${endDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}`;
    const shareUrl = `https://d4ily.com/hafta/${weekId}`; // Update with real domain if needed

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

                    <div className="container mx-auto px-4 max-w-4xl relative z-10">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">
                                {dateRange}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-foreground">
                            {weeklyDigest.title}
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            {weeklyDigest.intro}
                        </p>

                        <ShareButtons title={weeklyDigest.title} url={shareUrl} />

                        {/* Stats */}
                        <div className="mt-8 flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    {weeklyDigest.digests_count} Günlük Özet
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquareText className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    {weeklyDigest.tweets_count} Tweet Analiz
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <article className="prose prose-lg dark:prose-invert max-w-none">
                            <ReactMarkdown>{weeklyDigest.content}</ReactMarkdown>
                        </article>
                    </div>
                </section>

                {/* Highlights Section */}
                {weeklyDigest.highlights && weeklyDigest.highlights.length > 0 && (
                    <section className="py-16 bg-secondary/20 border-y border-border">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <div className="flex items-center gap-3 mb-8">
                                <TrendingUp className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl md:text-3xl font-bold font-serif">
                                    Haftanın Öne Çıkanları
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {weeklyDigest.highlights.map((category) => (
                                    <div key={category.category} className="bg-card border border-border rounded-xl p-6">
                                        <h3 className="text-lg font-bold mb-4 text-primary">
                                            {category.category}
                                        </h3>
                                        <ul className="space-y-2">
                                            {category.items.map((item, idx) => (
                                                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                                    <span className="text-primary font-bold">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Trends */}
                {weeklyDigest.trends && weeklyDigest.trends.length > 0 && (
                    <section className="py-16">
                        <div className="container mx-auto px-4 max-w-4xl">
                            <h2 className="text-2xl font-bold mb-6 font-serif">Haftanın Trendleri</h2>
                            <div className="flex flex-wrap gap-3">
                                {weeklyDigest.trends.map((trend) => (
                                    <span
                                        key={trend}
                                        className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                                    >
                                        {trend}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
