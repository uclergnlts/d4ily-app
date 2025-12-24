
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function AutoRefreshClient() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    router.refresh();
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full transition-all duration-500">
            <RefreshCw className={`h-3 w-3 ${timeLeft < 5 ? 'animate-spin' : ''}`} />
            <span>{timeLeft}sn içinde yenilenecek</span>
        </div>
    );
}
