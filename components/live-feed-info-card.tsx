import { cn } from "@/lib/utils"

interface LiveFeedInfoCardProps {
    className?: string
}

export function LiveFeedInfoCard({ className }: LiveFeedInfoCardProps) {
    return (
        <div className={cn("rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-primary/10 p-6", className)}>
            <h2 className="font-serif font-bold text-lg mb-2 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Canlı Yayın
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
                Şu anda takip edilen 60+ kişisel hesaptan (gazeteci, siyasetçi, uzman) gelen veriler anlık olarak akmaktadır.
            </p>
        </div>
    )
}
