"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function AutoRefreshClient() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Refresh the page data
                    router.refresh();
                    return 300; // Reset timer to 5 minutes
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    // Manual refresh button
    const handleManualRefresh = () => {
        setTimeLeft(300);
        router.refresh();
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full transition-all duration-500">
                <RefreshCw className={`h-3 w-3 ${timeLeft < 5 ? 'animate-spin' : ''}`} />
                <span>{formatTime(timeLeft)} içinde yenilenecek</span>
            </div>
            <button
                onClick={handleManualRefresh}
                className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
                title="Şimdi Yenile"
            >
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
        </div>
    );
}
