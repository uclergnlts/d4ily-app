"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Instagram, Share2 } from "lucide-react"
import { SocialShareCard } from "./social-share-card"

interface SocialShareDialogProps {
    date: string
    headline: string
    bulletPoints: string[]
    readingTime?: string
    coverImageUrl?: string
}

export function SocialShareDialog({
    date,
    headline,
    bulletPoints,
    readingTime,
    coverImageUrl,
}: SocialShareDialogProps) {
    const [variant, setVariant] = useState<"square" | "story">("story")

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white hover:from-purple-700 hover:to-pink-700">
                    <Share2 className="h-4 w-4" />
                    Sosyal Paylaşım Kartı Oluştur
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Instagram Paylaşımı Oluştur</DialogTitle>
                    <DialogDescription>
                        Özeti Instagram Story veya Post olarak paylaşmak için format seçin.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-secondary/50 p-1">
                        <Button
                            variant={variant === 'story' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setVariant('story')}
                            className="flex-1"
                        >
                            Story (9:16)
                        </Button>
                        <Button
                            variant={variant === 'square' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setVariant('square')}
                            className="flex-1"
                        >
                            Post (1:1)
                        </Button>
                    </div>

                    <div className="flex justify-center bg-zinc-950/5 p-4 rounded-xl border border-border/50">
                        <div className={variant === 'story' ? 'w-[320px]' : 'w-[400px]'}>
                            <SocialShareCard
                                date={date}
                                headline={headline}
                                bulletPoints={bulletPoints}
                                readingTime={readingTime}
                                showDownload={true}
                                variant={variant}
                                coverImageUrl={coverImageUrl}
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
