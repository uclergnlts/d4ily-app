import { Header } from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { getWeeklyDigestsArchive, getLatestWeeklyDigest } from "@/lib/digest-data";
import { Calendar, TrendingUp, FileText } from "lucide-react";

export const metadata = {
    title: "Haftalık Özetler - D4ily",
    description: "Geçmiş haftaların kapsamlı gündem özetleri",
};

export default async function WeeklyDigestsArchive() {
    const weeklyDigests = await getWeeklyDigestsArchive(24);
    const latestWeekly = await getLatestWeeklyDigest();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-600">
                                Haftalık Analizler
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
                            Haftalık Özetler
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Her haftanın en önemli gelişmelerini kapsamlı analizlerle keşfedin
                        </p>
                    </div>

                    {/* Latest Weekly Digest Highlight */}
                    {latestWeekly && (
                        <Link
                            href={`/hafta/${latestWeekly.week_id}`}
                            className="block mb-12 group"
                        >
                            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 p-8 md:p-12 transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-bold">
                                            SON YAYINLANAN
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            Hafta {latestWeekly.week_number}, {latestWeekly.year}
                                        </span>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 group-hover:text-primary transition-colors">
                                        {latestWeekly.title}
                                    </h2>

                                    <p className="text-lg text-muted-foreground mb-6">
                                        {latestWeekly.intro}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span>{latestWeekly.digests_count} Günlük Özet</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                            <span>{latestWeekly.tweets_count} Tweet Analiz</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Archive Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {weeklyDigests.map((weekly) => {
                            const startDate = new Date(weekly.start_date);
                            const endDate = new Date(weekly.end_date);
                            const isLatest = latestWeekly?.week_id === weekly.week_id;

                            if (isLatest) return null; // Already shown above

                            return (
                                <Link
                                    key={weekly.week_id}
                                    href={`/hafta/${weekly.week_id}`}
                                    className="group block"
                                >
                                    <div className="h-full overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1">
                                        <div className="h-32 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-6 flex flex-col justify-between">
                                            <div className="flex justify-between items-start text-white">
                                                <div>
                                                    <span className="text-4xl font-bold">{weekly.week_number}</span>
                                                    <span className="text-xs block opacity-90 uppercase tracking-wider">
                                                        Hafta
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium opacity-90">
                                                    {weekly.year}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {startDate.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })} - {endDate.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                                            </p>

                                            <h3 className="text-lg font-bold font-serif mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {weekly.title}
                                            </h3>

                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                                {weekly.intro}
                                            </p>

                                            <div className="flex gap-3 text-xs text-muted-foreground">
                                                <span>{weekly.digests_count} Özet</span>
                                                <span>•</span>
                                                <span>{weekly.tweets_count} Tweet</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
