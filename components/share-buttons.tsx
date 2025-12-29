
"use client";

import { Twitter, Link2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Bağlantı kopyalandı!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Kopyalama başarısız oldu.");
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-border">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        Paylaş:
      </span>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
      >
        <Twitter className="w-4 h-4" />
        <span className="hidden sm:inline">X'te Paylaş</span>
      </a>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
        aria-label="Link kopyala"
      >
        <Link2 className="w-4 h-4" />
        <span className="hidden sm:inline">Kopyala</span>
      </button>
    </div>
  );
}
